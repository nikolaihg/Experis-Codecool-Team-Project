using System.Text.Json;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;
using System.Text.Json.Serialization;

namespace Api.Data;

public static class DbSeeder
{
    public static async Task SeedAsync(AppDbContext context, UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
    {
        // Apply migrations first
        await context.Database.MigrateAsync();

        await SeedRolesAsync(roleManager);
        await SeedUsersAsync(userManager);
        await SeedTvShowsAsync(context);
    }

    private static async Task SeedRolesAsync(RoleManager<IdentityRole> roleManager)
    {
        string[] roles = { "Admin", "User" };
        foreach (var role in roles)
        {
            if (!await roleManager.RoleExistsAsync(role))
            {
                await roleManager.CreateAsync(new IdentityRole(role));
            }
        }
    }

    private static async Task SeedUsersAsync(UserManager<User> userManager)
    {
        if (await userManager.FindByNameAsync("superadmin") == null)
        {
            var adminUser = new User
            {
                UserName = "superadmin",
                Email = "superadmin@example.com",
                EmailConfirmed = true,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow,
                IsActive = true
            };

            var result = await userManager.CreateAsync(adminUser, "SuperAdmin123!");
            if (result.Succeeded)
            {
                await userManager.AddToRoleAsync(adminUser, "Admin");
            }
        }
    }

    private static async Task SeedTvShowsAsync(AppDbContext context)
    {
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

        // Get existing IDs from database
        var existingIds = await context.TVShows
            .Select(x => x.Id)
            .ToListAsync();

        // Find shows missing from database (deleted manually etc.)
        var missingShows = shows
            .Where(show => !existingIds.Contains(show.Id))
            .ToList();

        // Add only missing records
        if (missingShows.Any())
        {
            context.TVShows.AddRange(missingShows);
            await context.SaveChangesAsync();
        }

        // Sync PostgreSQL auto-increment sequence with highest ID
        await context.Database.ExecuteSqlRawAsync(@"
            SELECT setval(
                pg_get_serial_sequence('""TVShows""', 'Id'),
                COALESCE((SELECT MAX(""Id"") FROM ""TVShows""), 1)
            );
        ");
    }
}