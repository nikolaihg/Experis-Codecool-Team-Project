using System.Net;
using System.Net.Http.Json;
using System.Text;
using System.Text.Json;
using Api.DTOs;
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
        Assert.Single(data.UserShowEntryList);
    }
    
    [Fact]
    public async Task CreateUserList()
    {
        var list = new UserList
        {
            Name = "WatchList1",
            Type = ListType.Watchlist,
            IsPublic = true
        };
        
        var content = new StringContent(
            JsonSerializer.Serialize(list),
            Encoding.UTF8,
            "application/json"
        );

        var response = await _client.PostAsync("/api/lists", content);
        response.EnsureSuccessStatusCode();
    
        var data = await response.Content.ReadFromJsonAsync<UserList>();
        
        Assert.Equal(list.Name, data.Name);
        Assert.Equal(list.Type, data.Type);
        Assert.True(data.IsPublic);
        Assert.Equal("12345", data.UserId);
        Assert.Empty(data.UserShowEntryList);
    }
    
    [Fact]
    public async Task DeleteUserList()
    {
        var response = await _client.DeleteAsync("/api/lists/1");
        response.EnsureSuccessStatusCode();
    
        Assert.Equal(HttpStatusCode.NoContent, response.StatusCode);
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