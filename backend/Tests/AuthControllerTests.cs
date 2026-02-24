using Api.Configuration;
using Api.Controllers;
using Api.DTOs;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;
using Moq;
using NUnit.Framework;

namespace Tests;

[TestFixture]
public class AuthControllerTests
{
    private Mock<UserManager<User>> _userManager = null!;
    private Mock<IJwtService> _jwtService = null!;
    private Mock<IOptions<JwtOptions>> _jwtOptions = null!;
    private AuthController _sut = null!;

    [SetUp]
    public void SetUp()
    {
        var store = new Mock<IUserStore<User>>();
        _userManager = new Mock<UserManager<User>>(
            store.Object,
            null!, null!, null!, null!, null!, null!, null!, null!
        );

        _jwtService = new Mock<IJwtService>();
        _jwtOptions = new Mock<IOptions<JwtOptions>>();
        _jwtOptions.Setup(x => x.Value).Returns(new JwtOptions
        {
            Issuer = "test",
            Audience = "test",
            SigningKey = "super-secret-key",
            ExpiresInMinutes = 30
        });

        _sut = new AuthController(_jwtOptions.Object, _jwtService.Object, _userManager.Object);
    }

    [Test]
    public async Task Register_WhenSuccessful_ReturnsOkWithToken()
    {
        var dto = new UserDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "SecurePass123!"
        };

        _userManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Success);

        _userManager
            .Setup(x => x.AddToRoleAsync(It.IsAny<User>(), "User"))
            .ReturnsAsync(IdentityResult.Success);

        _userManager
            .Setup(x => x.GetRolesAsync(It.IsAny<User>()))
            .ReturnsAsync(new List<string> { "User" });

        _jwtService
            .Setup(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()))
            .Returns("valid.jwt.token");

        var result = await _sut.Register(dto) as OkObjectResult;

        Assert.That(result, Is.Not.Null);
        var response = (AuthResponseDto)result!.Value!;
        Assert.That(response.Token, Is.EqualTo("valid.jwt.token"));
        Assert.That(response.ExpiresIn, Is.EqualTo(30));
        _userManager.Verify(x => x.CreateAsync(It.IsAny<User>(), dto.Password), Times.Once);
        _userManager.Verify(x => x.AddToRoleAsync(It.IsAny<User>(), "User"), Times.Once);
        _jwtService.Verify(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()), Times.Once);
    }

    [Test]
    public async Task Register_WhenUserCreationFails_ReturnsBadRequest()
    {
        var dto = new UserDto
        {
            Username = "testuser",
            Email = "test@example.com",
            Password = "weak"
        };

        var errors = new[] { new IdentityError { Code = "PasswordTooShort", Description = "Password is too short" } };
        _userManager
            .Setup(x => x.CreateAsync(It.IsAny<User>(), dto.Password))
            .ReturnsAsync(IdentityResult.Failed(errors));

        var result = await _sut.Register(dto) as BadRequestObjectResult;

        Assert.That(result, Is.Not.Null);
        _jwtService.Verify(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()), Times.Never);
    }

    [Test]
    public async Task Login_WhenCredentialsValid_ReturnsOkWithToken()
    {
        var dto = new UserDto
        {
            Username = "ignored",
            Email = "user@example.com",
            Password = "CorrectPassword123!"
        };

        var user = new User
        {
            Id = "u123",
            Email = dto.Email,
            UserName = "testuser"
        };

        _userManager
            .Setup(x => x.FindByEmailAsync(dto.Email))
            .ReturnsAsync(user);

        _userManager
            .Setup(x => x.CheckPasswordAsync(user, dto.Password))
            .ReturnsAsync(true);

        _userManager
            .Setup(x => x.GetRolesAsync(user))
            .ReturnsAsync(new List<string> { "User" });

        _jwtService
            .Setup(x => x.GenerateToken(user, It.IsAny<IEnumerable<string>>()))
            .Returns("valid.jwt.token");

        var result = await _sut.Login(dto) as OkObjectResult;

        Assert.That(result, Is.Not.Null);
        var response = (AuthResponseDto)result!.Value!;
        Assert.That(response.Token, Is.EqualTo("valid.jwt.token"));
        _jwtService.Verify(x => x.GenerateToken(user, It.IsAny<IEnumerable<string>>()), Times.Once);
    }

    [Test]
    public async Task Login_WhenUserNotFound_ReturnsUnauthorized()
    {
        var dto = new UserDto
        {
            Username = "ignored",
            Email = "nonexistent@example.com",
            Password = "AnyPassword123!"
        };

        _userManager
            .Setup(x => x.FindByEmailAsync(dto.Email))
            .ReturnsAsync((User?)null);

        var result = await _sut.Login(dto) as UnauthorizedObjectResult;

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Value, Is.EqualTo("Invalid email or password!"));
        _jwtService.Verify(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()), Times.Never);
    }

    [Test]
    public async Task Login_WhenPasswordInvalid_ReturnsUnauthorized()
    {
        var dto = new UserDto
        {
            Username = "ignored",
            Email = "user@example.com",
            Password = "WrongPassword123!"
        };

        var user = new User
        {
            Id = "u123",
            Email = dto.Email,
            UserName = "testuser"
        };

        _userManager
            .Setup(x => x.FindByEmailAsync(dto.Email))
            .ReturnsAsync(user);

        _userManager
            .Setup(x => x.CheckPasswordAsync(user, dto.Password))
            .ReturnsAsync(false);

        var result = await _sut.Login(dto) as UnauthorizedObjectResult;

        Assert.That(result, Is.Not.Null);
        Assert.That(result!.Value, Is.EqualTo("Invalid email or password!"));
        _jwtService.Verify(x => x.GenerateToken(It.IsAny<User>(), It.IsAny<IEnumerable<string>>()), Times.Never);
    }
}
