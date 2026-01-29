using System.Text;
using Api.Configuration;
using Api.Data;
using Api.Models;
using Api.Services;
using dotenv.net;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using Microsoft.IdentityModel.Tokens;

DotEnv.Load();

var builder = WebApplication.CreateBuilder(args);
builder.Configuration.AddEnvironmentVariables();

// DB Config stuff
string BuildConnectionString()
{
    var host = Environment.GetEnvironmentVariable("DB_HOST")
               ?? throw new ArgumentException("DB_HOST is required");
    var port = Environment.GetEnvironmentVariable("DB_PORT")
               ?? throw new ArgumentException("DB_PORT is required");
    var database = Environment.GetEnvironmentVariable("DB_NAME")
                   ?? throw new ArgumentException("DB_NAME is required");
    var username = Environment.GetEnvironmentVariable("DB_USER")
                   ?? throw new ArgumentException("DB_USER is required");
    var password = Environment.GetEnvironmentVariable("DB_PASSWORD")
                   ?? throw new ArgumentException("DB_PASSWORD is required");

    return $"Host={host};Port={port};Username={username};Password={password};Database={database}";
}


var connectionString = BuildConnectionString();

// JWT Config stuff
builder.Services
    .AddOptions<JwtOptions>()
    .Bind(builder.Configuration.GetSection("Jwt"))
    .ValidateDataAnnotations()
    .ValidateOnStart();


string jwtIssuer = Environment.GetEnvironmentVariable("Jwt__Issuer")!;
string jwtAudience = Environment.GetEnvironmentVariable("Jwt__Audience")!;
string jwtKey = Environment.GetEnvironmentVariable("Jwt__SigningKey")!;

// Dependency Injection
// DB stuff
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services
    .AddIdentity<User, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();

// Jwt & RBAC stuff
builder.Services.AddAuthentication(options =>
    {
        options.DefaultAuthenticateScheme = JwtBearerDefaults.AuthenticationScheme;
        options.DefaultChallengeScheme = JwtBearerDefaults.AuthenticationScheme;
    })
    .AddJwtBearer(options =>
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,

            ValidIssuer = jwtIssuer,
            ValidAudience = jwtAudience,
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(jwtKey))
        });

builder.Services.AddAuthorizationBuilder()
    .AddDefaultPolicy("User", new AuthorizationPolicyBuilder()
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build())
    .AddPolicy("Admin", new AuthorizationPolicyBuilder()
        .RequireRole("Admin")
        .AddAuthenticationSchemes(JwtBearerDefaults.AuthenticationScheme)
        .RequireAuthenticatedUser()
        .Build());

builder.Services.Configure<JwtOptions>(options =>
{
    options.Issuer = jwtIssuer;
    options.Audience = jwtAudience;
    options.SigningKey = jwtKey;
    options.ExpiresInMinutes = int.Parse(
        Environment.GetEnvironmentVariable("Jwt__ExpiresInMinutes")!
    );
});

// Services
builder.Services.AddScoped<IJwtService, JwtService>();

// Web stuff
builder.Services.AddControllers();
builder.Services.AddOpenApi();
builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.MapControllers();

// Ensure required Identity roles exist (synchronous blocking call is fine during startup)
using (var scope = app.Services.CreateScope())
{
    var roleManager = scope.ServiceProvider.GetRequiredService<RoleManager<IdentityRole>>();
    var requiredRoles = new[] { "User", "Admin" };
    foreach (var roleName in requiredRoles)
    {
        var exists = roleManager.RoleExistsAsync(roleName).GetAwaiter().GetResult();
        if (!exists)
        {
            var createResult = roleManager.CreateAsync(new IdentityRole(roleName)).GetAwaiter().GetResult();
            if (!createResult.Succeeded)
            {
                var errors = string.Join(", ", createResult.Errors.Select(e => e.Description));
                throw new Exception($"Failed to create role '{roleName}': {errors}");
            }
        }
    }
}

app.Run();