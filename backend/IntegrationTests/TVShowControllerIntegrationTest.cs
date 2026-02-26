using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Api.Models;

namespace IntegrationTests;

public class TVShowControllerIntegrationTest
{
    private readonly WebApplicationFactory _app;
    private readonly HttpClient _client;

    public TVShowControllerIntegrationTest()
    {
        _app = new WebApplicationFactory();
        _client = _app.CreateClient();
    }
    
    [Fact]
    public async Task GetTvShowById()
    {
        var response = await _client.GetAsync("/api/tvshow/1");
        response.EnsureSuccessStatusCode();
    
        var data = await response.Content.ReadFromJsonAsync<TVShow>();
        
        Assert.Equal(1, data.Id);
        Assert.Equal("Breaking Bad", data.Title);
        Assert.Equal("A chemistry teacher becomes a drug kingpin.", data.Description);
        Assert.Equal(2008, data.ReleaseYear);
        Assert.Equal(62, data.AmountOfEpisodes);
        Assert.Equal(new DateTime(2026, 1, 21, 8, 30, 52), data.CreatedAt);
        Assert.Equal("Drama", data.Genre);
        Assert.Equal(9.5, data.ImdbRating);
        Assert.Equal("https://image.tmdb.org/t/p/original/ztkUQFLlC19CCMYHW9o1zWhJRNq.jpg", data.PosterUrl);
        Assert.Equal(TVShowStatus.Ended, data.Status);
        Assert.Equal(0, data.TotalUsersWatched);
    }
    
    [Fact]
    public async Task CreateTvShow()
    {
        var show = new TVShow
        {
            Title = "Game of Thrones",
            Description = "Noble families compete for control of the Iron Throne in a fantasy world filled with political intrigue.",
            ReleaseYear = 2011,
            PosterUrl = "https://m.media-amazon.com/images/I/71y9prMcV8L._AC_UF1000,1000_QL80_.jpg",
            Status = TVShowStatus.Ended,
            CreatedAt = new DateTime(2024, 1, 1, 0, 0, 0),
            Genre = "Fantasy",
            ImdbRating = 9.2,
            AmountOfEpisodes = 73,
            TotalUsersWatched = 0
        };
        
        var content = new StringContent(
            JsonSerializer.Serialize(show),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _client.PostAsync("/api/tvshow", content);
        response.EnsureSuccessStatusCode();
    }
    
    [Fact]
    public async Task DeleteTvShow()
    {
        var response = await _client.DeleteAsync("/api/tvshow/1");
        response.EnsureSuccessStatusCode();
    
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
    }
    
}