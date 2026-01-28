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

builder.Services.AddControllers();

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.MapOpenApi();
}

app.UseHttpsRedirection();

var summaries = new[]
{
    "Freezing", "Bracing", "Chilly", "Cool", "Mild", "Warm", "Balmy", "Hot", "Sweltering", "Scorching"
};

app.MapGet("/weatherforecast", () =>
    {
        var forecast =  Enumerable.Range(1, 5).Select(index =>
                new WeatherForecast
                (
                    DateOnly.FromDateTime(DateTime.Now.AddDays(index)),
                    Random.Shared.Next(-20, 55),
                    summaries[Random.Shared.Next(summaries.Length)]
                ))
            .ToArray();
        return forecast;
    })
    .WithName("GetWeatherForecast");

app.MapControllers();
app.UseHttpsRedirection();
app.UseAuthentication();
app.UseAuthorization();

app.Run();

record WeatherForecast(DateOnly Date, int TemperatureC, string? Summary)
{
    public int TemperatureF => 32 + (int)(TemperatureC / 0.5556);
}