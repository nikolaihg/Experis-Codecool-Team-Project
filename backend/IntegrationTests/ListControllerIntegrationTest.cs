using System.Net.Http.Json;
using Api.Models;

namespace IntegrationTests;

public class ListControllerIntegrationTest
{
    private readonly WebApplicationFactory _app;
    private readonly HttpClient _client;

    public ListControllerIntegrationTest()
    {
        _app = new WebApplicationFactory();
        _client = _app.CreateClient();
    }
    
    
    [Fact]
    public async Task GetListById()
    {
        var response = await _client.GetAsync("/api/lists/1");
        response.EnsureSuccessStatusCode();
    
        var data = await response.Content.ReadFromJsonAsync<UserList>();
        
        Assert.Equal("Diary", data.Name);
        Assert.Equal(ListType.Diary, data.Type);
        Assert.True(data.IsPublic);
        Assert.Equal(new DateTime(2026, 1, 21, 8, 30, 52), data.CreatedAt);
        Assert.Equal(new DateTime(2026, 1, 26, 6, 50, 45), data.UpdatedAt);
        Assert.Equal("12345", data.UserId);
    }
    
    [Fact]
    public async Task GetItemById()
    {
        var response = await _client.GetAsync("/api/lists/1/items/1");
        response.EnsureSuccessStatusCode();
    
        var data = await response.Content.ReadFromJsonAsync<UserShowEntry>();
        
        Assert.Equal(1, data.UserListId);
        Assert.Equal(1, data.TVShowId);
        Assert.Equal(UserWatchStatus.Completed, data.Status);
        Assert.Equal(7, data.Rating);
        Assert.Equal(new DateTime(2026, 1, 26, 15, 35, 30), data.LoggedAt);
    }
    
}