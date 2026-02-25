using System.Security.Claims;
using System.Text.Encodings.Web;
using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Authentication;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Mvc.Testing;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Infrastructure;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Logging;
using Microsoft.Extensions.Options;

namespace IntegrationTests;

public class WebApplicationFactory : WebApplicationFactory<Program>
{
    private readonly string _dbName = Guid.NewGuid().ToString();
    
    protected override void ConfigureWebHost(IWebHostBuilder builder)
    {
        builder.ConfigureAppConfiguration((ctx, config) =>
        {
            var kv = new Dictionary<string, string?>
            {
                ["Jwt:Issuer"] = "TestIssuer",
                ["Jwt:Audience"] = "TestAudience",
                ["Jwt:SigningKey"] = "THIS_IS_A_TEST_SIGNING_KEY_32_CHARS_MINIMUM"
            };
            config.AddInMemoryCollection(kv);
        });
        
        builder.ConfigureServices(services =>
        {
            
            var authDescriptors = services
                .Where(s => s.ServiceType == typeof(IAuthenticationSchemeProvider)
                            || s.ImplementationType?.Name?.Contains("Jwt", StringComparison.OrdinalIgnoreCase) == true)
                .ToList();

            foreach (var d in authDescriptors)
                services.Remove(d);
            
            
            services.AddAuthentication(TestAuthHandler.AuthenticationScheme)
                .AddScheme<AuthenticationSchemeOptions, TestAuthHandler>(
                    TestAuthHandler.AuthenticationScheme, options => { });

            services.AddAuthorization(options =>
            {
                options.DefaultPolicy = new AuthorizationPolicyBuilder(TestAuthHandler.AuthenticationScheme)
                    .RequireAuthenticatedUser()
                    .Build();

                options.AddPolicy("Admin", p =>
                    p.RequireRole("Admin")
                        .AddAuthenticationSchemes(TestAuthHandler.AuthenticationScheme));
            });
            
            services.Remove(
                services.SingleOrDefault(d => d.ServiceType == typeof(IDbContextOptionsConfiguration<AppDbContext>))
            );
    
            services.AddDbContext<AppDbContext>(options =>
            {
                options.UseInMemoryDatabase(_dbName);
            });
    
            using var scope = services.BuildServiceProvider().CreateScope();
    
            //We use this scope to request the registered dbcontext, and initialize the schemas
            var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();
            context.Database.EnsureDeleted();
            context.Database.EnsureCreated();
            
            var testUserId = "12345";
            
            var userList = new UserList
                {
                    Id = 1,
                    Name = "Diary",
                    Type = ListType.Diary,
                    IsPublic = true,
                    CreatedAt = new DateTime(2026, 1, 21, 8, 30, 52),
                    UpdatedAt = new DateTime(2026, 1, 26, 6, 50, 45),
                    UserId = testUserId
                };
            
            if (!context.UserLists.Any())
            {
                context.UserLists.Add(userList);
                context.SaveChanges();
            }
            
            var tvShow = new TVShow
            {
                Id = 1,
                Title = "Breaking Bad",
                Description = "A chemistry teacher becomes a drug kingpin.",
                ReleaseYear = 2008,
                AmountOfEpisodes = 62,
                CreatedAt = new DateTime(2026, 1, 21, 8, 30, 52),
                Genre = "Drama",
                ImdbRating = 9.5,
                PosterUrl = "https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg",
                Status = TVShowStatus.Ended,
                TotalUsersWatched = 0
            };
            
            if (!context.TVShows.Any())
            {
                context.TVShows.Add(tvShow);
                context.SaveChanges();
            }
            
            var entry = new UserShowEntry
            {
                UserListId = 1,
                TVShowId = 1,
                Status = UserWatchStatus.Completed,
                Rating = 7,
                LoggedAt = new DateTime(2026, 1, 26, 15, 35, 30),
            };
            
            if (!context.UserShowEntries.Any())
            {
                context.UserShowEntries.Add(entry);
                context.SaveChanges();
            }
            
        });
    }
    
    
    public class TestAuthHandler : AuthenticationHandler<AuthenticationSchemeOptions>
    {
        public const string AuthenticationScheme = "TestScheme";

        public TestAuthHandler(IOptionsMonitor<AuthenticationSchemeOptions> options,
            ILoggerFactory logger, UrlEncoder encoder, ISystemClock clock)
            : base(options, logger, encoder, clock)
        {
        }

        protected override Task<AuthenticateResult> HandleAuthenticateAsync()
        {
            var claims = new[] {
                new Claim(ClaimTypes.Name, "Test user"),
                new Claim(ClaimTypes.NameIdentifier, "12345"),
                new Claim(ClaimTypes.Role, "Admin")
            };
            var identity = new ClaimsIdentity(claims, AuthenticationScheme);
            var principal = new ClaimsPrincipal(identity);
            var ticket = new AuthenticationTicket(principal, AuthenticationScheme);

            var result = AuthenticateResult.Success(ticket);
            return Task.FromResult(result);
        }
    }
}