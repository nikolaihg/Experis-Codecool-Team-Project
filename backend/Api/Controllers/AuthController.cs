using Api.Configuration;
using Api.DTOs;
using Api.Models;
using Api.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Options;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
public class AuthController : ControllerBase
{
    private readonly JwtOptions _jwtOptions;
    private readonly IJwtService  _jwtService;
    private readonly UserManager<User> _userManager;

    public AuthController(IOptions<JwtOptions> jwtOptions, IJwtService jwtService, UserManager<User> userManager)
    {
        _jwtOptions = jwtOptions.Value;
        _jwtService = jwtService;
        _userManager = userManager;
    }
    
    [HttpPost("register")]
    [AllowAnonymous]
    public async Task<IActionResult> Register([FromBody] UserDto dto)
    {
        var user = new User
        {
            UserName = dto.Email,
            Email = dto.Email,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            IsActive = true
        };

        var result = await _userManager.CreateAsync(user, dto.Password);
        if (!result.Succeeded)
            return BadRequest(result.Errors);

        await _userManager.AddToRoleAsync(user, "User");
        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtService.GenerateToken(user, roles);

        return Ok(new AuthResponseDto(token, _jwtOptions.ExpiresInMinutes));
    }

    [HttpPost("login")]
    [AllowAnonymous]
    public async Task<IActionResult> Login([FromBody] UserDto dto)
    {
        var user = await _userManager.FindByEmailAsync(dto.Email);
        if (user == null)
            return Unauthorized("Invalid email or password!");
        var passwordValid = await _userManager.CheckPasswordAsync(user, dto.Password);
        if (!passwordValid)
            return Unauthorized("Invalid email or password!");
        
        var roles = await _userManager.GetRolesAsync(user);
        var token = _jwtService.GenerateToken(user, roles);
        
        return Ok(new AuthResponseDto(token, _jwtOptions.ExpiresInMinutes));
    }
    
    [Authorize(Roles = "Admin")]
    [HttpPost("make-admin/{userId}")]
    public async Task<IActionResult> MakeAdmin(string userId)
    {
        try
        {
            var user = await _userManager.FindByIdAsync(userId);
            if (user == null)
                return NotFound($"User with id {userId} not found.");

            var isAlreadyAdmin = await _userManager.IsInRoleAsync(user, "Admin");
            if (isAlreadyAdmin)
                return BadRequest("User is already an admin.");

            var result = await _userManager.AddToRoleAsync(user, "Admin");
            if (!result.Succeeded)
                return BadRequest($"Failed to make user admin: {string.Join(", ", result.Errors.Select(e => e.Description))}");

            return Ok(new { message = $"User {user.Email} is now an admin." });
        }
        catch (Exception ex)
        {
            return StatusCode(500, ex.Message);
        }
    }

    [Authorize]
    [HttpGet("ping")]
    public IActionResult Ping()
    {
        return Ok(new
        {
            message = "PONG!",
            user = User.Identity?.Name
        });
    }
}