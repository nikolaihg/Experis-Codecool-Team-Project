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

    public UserController(IUserRepository userRepository, IUserListRepository userListRepository)
    {
        _userRepository = userRepository;
        _userListRepository = userListRepository;
    }
    
    [HttpGet]
    [Authorize(Roles = "User")]
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
    [Authorize(Roles = "User")]
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
    [Authorize(Roles = "User")]
    public async Task<IActionResult> GetUserLists(string userId)
    {
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");

        var lists = user.UserLists;
        return Ok(lists);
    }

    [HttpPost("{userId}/lists")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> CreateUserList(string userId, [FromBody] UserList userList)
    {
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");

        userList.UserId = userId;
        userList.CreatedAt = DateTime.Now;
        userList.UpdatedAt = DateTime.Now;

        var created = await _userListRepository.Create(userList);
        return CreatedAtAction(nameof(GetUserLists), new { userId }, created);
    }

    [HttpPut("{userId}/lists/{listId:int}")]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> UpdateUserList(string userId, int listId, [FromBody] UserList userList)
    {
        var user = await _userRepository.Read(userId);
        if (user == null)
            return NotFound("User not found.");

        var existingList = await _userListRepository.Read(listId);
        if (existingList == null || existingList.UserId != userId)
            return NotFound();

        userList.UserId = userId;
        var success = await _userListRepository.Update(listId, userList);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{userId}/lists/{listId:int}")]
    [Authorize(Roles = "User")]
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
