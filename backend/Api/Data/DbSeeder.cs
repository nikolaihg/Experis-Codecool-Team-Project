using System.Text.Json;
using Api.Models;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context)
    {
        await context.Database.MigrateAsync();

        if (await context.TVShows.AnyAsync())
            return; // already seeded

        var path = Path.Combine(
            Directory.GetCurrentDirectory(),
            "Data",
            "SeedData",
            "tvshows.json"
        );

        if (!File.Exists(path))
            return;

        var json = await File.ReadAllTextAsync(path);

        var options = new JsonSerializerOptions
        {
            PropertyNameCaseInsensitive = true,
            Converters = { new JsonStringEnumConverter() }
        };

        var shows = JsonSerializer.Deserialize<List<TVShow>>(json, options);

        if (shows == null || !shows.Any())
            return;

        context.TVShows.AddRange(shows);
        await context.SaveChangesAsync();
    }
}