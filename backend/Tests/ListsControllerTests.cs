using System.Security.Claims;
using Api.Controllers;
using Api.DTOs;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Moq;
using NUnit.Framework;

namespace Tests;

[TestFixture]
public class ListsControllerTests
{
    private Mock<IUserListRepository> _listRepo = null!;
    private Mock<IUserShowEntryRepository> _entryRepo = null!;
    private Mock<IUserRepository> _userRepo = null!;
    private ListsController _sut = null!;

    [SetUp]
    public void SetUp()
    {
        _listRepo = new Mock<IUserListRepository>();
        _entryRepo = new Mock<IUserShowEntryRepository>();
        _userRepo = new Mock<IUserRepository>();
        _sut = new ListsController(_listRepo.Object, _entryRepo.Object, _userRepo.Object);
    }

    private void SetUser(string? userId)
    {
        var identity = userId == null
            ? new ClaimsIdentity()
            : new ClaimsIdentity(new[] { new Claim(ClaimTypes.NameIdentifier, userId) }, "test");

        _sut.ControllerContext = new ControllerContext
        {
            HttpContext = new DefaultHttpContext
            {
                User = new ClaimsPrincipal(identity)
            }
        };
    }

    [Test]
    public async Task GetLists_WhenNoUser_ReturnsUnauthorized()
    {
        SetUser(null);

        var result = await _sut.GetLists();

        Assert.That(result, Is.TypeOf<UnauthorizedResult>());
    }

    [Test]
    public async Task GetList_WhenPrivateAndNotOwner_ReturnsForbid()
    {
        SetUser("current-user");
        _listRepo.Setup(x => x.Read(5)).ReturnsAsync(new UserList
        {
            Id = 5,
            Name = "Private",
            UserId = "owner-user",
            IsPublic = false
        });

        var result = await _sut.GetList(5);

        Assert.That(result, Is.TypeOf<ForbidResult>());
    }

    [Test]
    public async Task RemoveItem_WhenItemNotInList_ReturnsNotFound()
    {
        SetUser("u1");
        _listRepo.Setup(x => x.Read(5)).ReturnsAsync(new UserList
        {
            Id = 5,
            Name = "List",
            UserId = "u1",
            IsPublic = false,
            UserShowEntryList = new List<UserShowEntry>
            {
                new() { Id = 100, TVShowId = 10 }
            }
        });

        var result = await _sut.RemoveItem(5, 999);

        Assert.That(result, Is.TypeOf<NotFoundObjectResult>());
    }

    [Test]
    public async Task CreateList_WithItems_DefaultsNullRatingToZero()
    {
        SetUser("u1");
        _listRepo.Setup(x => x.Create(It.IsAny<UserList>()))
            .ReturnsAsync((UserList l) => { l.Id = 99; return l; });

        var dto = new CreateUserListDto
        {
            Name = "My List",
            Type = ListType.Custom,
            IsPublic = true,
            Items = new()
            {
                new CreateListEntryDto { TvShowId = 10, Status = UserWatchStatus.Watching, Rating = null }
            }
        };

        var result = await _sut.CreateList(dto) as CreatedAtActionResult;

        Assert.That(result, Is.Not.Null);
        var created = (UserList)result!.Value!;
        Assert.That(created.UserShowEntryList.Count, Is.EqualTo(1));
        Assert.That(created.UserShowEntryList.First().Rating, Is.EqualTo(0));
    }

    [Test]
    public async Task GetList_WhenListNotFound_ReturnsNotFound()
    {
        SetUser("u1");
        _listRepo.Setup(x => x.Read(42)).ReturnsAsync((UserList?)null);

        var result = await _sut.GetList(42);

        Assert.That(result, Is.TypeOf<NotFoundResult>());
    }

    [Test]
    public async Task AddItem_WhenTvShowAlreadyInList_ReturnsConflict()
    {
        SetUser("u1");
        _listRepo.Setup(x => x.Read(5)).ReturnsAsync(new UserList
        {
            Id = 5,
            Name = "List",
            UserId = "u1",
            IsPublic = false
        });
        _entryRepo.Setup(x => x.ExistsInList(5, 10)).ReturnsAsync(true);

        var dto = new CreateListEntryDto
        {
            TvShowId = 10,
            Status = UserWatchStatus.Planning,
            Rating = 8
        };

        var result = await _sut.AddItem(5, dto);

        Assert.That(result, Is.TypeOf<ConflictObjectResult>());
    }
}