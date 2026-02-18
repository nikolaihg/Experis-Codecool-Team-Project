using Microsoft.AspNetCore.Mvc;
using Api.Models;
using Api.Repositories;
using Api.DTOs;
using Microsoft.AspNetCore.Authorization;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class UserController : ControllerBase
{
    private readonly IUserRepository _userRepository;

    public UserController(IUserRepository userRepository)
    {
        _userRepository = userRepository;
    }
    
    [HttpGet]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userRepository.GetAll();
        var userDtos = users.Select(u => new UserResponseDto
        {
            Id = u.Id,
            Email = u.Email,
            UserName = u.UserName,
            CreatedAt = u.CreatedAt,
            UpdatedAt = u.UpdatedAt,
            IsActive = u.IsActive
        }).ToList();
        return Ok(userDtos);
    }

    [HttpGet("{id}")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> GetById(string id)
    {
        var user = await _userRepository.Read(id);
        if (user == null)
            return NotFound();

        var userDto = new UserResponseDto
        {
            Id = user.Id,
            Email = user.Email,
            UserName = user.UserName,
            CreatedAt = user.CreatedAt,
            UpdatedAt = user.UpdatedAt,
            IsActive = user.IsActive
        };
        return Ok(userDto);
    }

    [HttpPut("{id}")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> Update(string id, [FromBody] User user)
    {
        var success = await _userRepository.Update(id, user);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<IActionResult> Delete(string id)
    {
        var success = await _userRepository.Delete(id);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
