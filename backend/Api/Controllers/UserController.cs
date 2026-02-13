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
    private readonly IUserListRepository _userListRepository;

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

    [HttpGet("{userId}/lists")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> GetUserLists(string userId)
    {
        Console.WriteLine($"Getting lists for user {userId}"); // Debug log
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");

        var lists = user.UserLists;
        if(lists == null)
            return NotFound("User lists not found.");
        return Ok(lists);
    }

    [HttpPost("{userId}/lists")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> CreateUserList(string userId, [FromBody] CreateUserListDto dto)
    {
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");
        
        var now = DateTime.UtcNow;

        var userList = new UserList
        {
            Name = dto.Name,
            Type = dto.Type,
            IsPublic = dto.IsPublic,
            CreatedAt = now,
            UpdatedAt = now,
            UserId = userId,
            User = null
        };

        var created = await _userListRepository.Create(userList);
        return Ok(created.Id);
    }

    [HttpPost("{userId}/lists/{listId:int}")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> UpdateUserList(string userId, int listId, [FromBody] UserShowEntry userEntry)
    {
        var existingList = await _userListRepository.Read(listId);
        if (existingList == null || existingList.UserId != userId)
            return NotFound("List not found or belongs to another user");

Console.WriteLine(userEntry.TVShowId);
        var success = await _userListRepository.Add(listId, userEntry);
        if (!success)
            return NotFound("Failed to add TV show to list.");

        return NoContent();
    }

    [HttpDelete("{userId}/lists/{listId:int}")]
    [Authorize(Roles = "User, Admin")]
    public async Task<IActionResult> DeleteUserList(string userId, int listId)
    {
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");

        var existingList = await _userListRepository.Read(listId);
        if (existingList == null || existingList.UserId != userId)
            return NotFound();

        var success = await _userListRepository.Delete(listId);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
