using Api.Controllers;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Logging;
using Moq;
using NUnit.Framework;

namespace Tests;

[TestFixture]
public class TVShowControllerTests
{
    private Mock<ITVShowRepository> _repo = null!;
    private TVShowController _sut = null!;

    [SetUp]
    public void SetUp()
    {
        _repo = new Mock<ITVShowRepository>();
        var logger = new Mock<ILogger<TVShowController>>();

        // System under test (sut)
        _sut = new TVShowController(logger.Object, _repo.Object);
    }

    [Test]
    public async Task GetById_WhenMissing_ReturnsNotFound()
    {
        _repo.Setup(x => x.Read(42)).ReturnsAsync((TVShow?)null);

        var result = await _sut.GetById(42);

        Assert.That(result.Result, Is.TypeOf<NotFoundResult>());
    }

    [Test]
    public async Task Update_WhenRepoReturnsFalse_ReturnsNotFound()
    {
        _repo.Setup(x => x.Update(1, It.IsAny<TVShow>())).ReturnsAsync(false);

        var result = await _sut.Update(1, new TVShow { Title = "X" });

        Assert.That(result, Is.TypeOf<NotFoundResult>());
    }

    [Test]
    public async Task Search_WhenQueryTooShort_ReturnsEmptyArray()
    {
        var result = await _sut.Search("a") as OkObjectResult;

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Value, Is.AssignableTo<Array>());
    }
}