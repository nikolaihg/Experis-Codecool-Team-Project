using System.Net.Http.Json;
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
}