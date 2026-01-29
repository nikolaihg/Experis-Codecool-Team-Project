using Api.Data;
using dotenv.net;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

var builder = WebApplication.CreateBuilder(args);

DotEnv.Load();
builder.Configuration.AddEnvironmentVariables();
builder.Services.AddOpenApi();

string BuildConnectionString()
{
    var host = builder.Configuration["DB_HOST"]
               ?? throw new ArgumentException("DB_HOST is required");
    var port = builder.Configuration["DB_PORT"]
               ?? throw new ArgumentException("DB_PORT is required");
    var database = builder.Configuration["DB_NAME"]
                   ?? throw new ArgumentException("DB_NAME is required");
    var username = builder.Configuration["DB_USER"]
                   ?? throw new ArgumentException("DB_USER is required");
    var password = Uri.EscapeDataString(builder.Configuration["DB_PASSWORD"]
                   ?? throw new ArgumentException("DB_PASSWORD is required"));

    return $"Host={host};Port={port};Username={username};Password={password};Database={database}";
}

builder.Services.AddDbContext<AppDbContext>(options => options.UseNpgsql(BuildConnectionString()));
builder.Services
    .AddIdentity<IdentityUser, IdentityRole>()
    .AddEntityFrameworkStores<AppDbContext>()
    .AddDefaultTokenProviders();


var app = builder.Build();

if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.MapControllers();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();
app.Run();