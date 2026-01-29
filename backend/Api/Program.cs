using System.Text;
using Api.Configuration;
using Api.Data;
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


string jwtIssuer = Environment.GetEnvironmentVariable("JWT_VALID_ISSUER")!;
string jwtAudience = Environment.GetEnvironmentVariable("JWT_VALID_AUDIENCE")!;
string jwtKey = Environment.GetEnvironmentVariable("JWT_SIGNING_KEY")!;


// Dependency Injection
// DB stuff
builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(connectionString));
builder.Services
    .AddIdentity<IdentityUser, IdentityRole>()
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
        Environment.GetEnvironmentVariable("JWT_EXPIRES_IN_MINUTES")!
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

app.Run();