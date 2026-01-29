using Microsoft.AspNetCore.Mvc;
using Api.Services;

namespace Api.Controllers;

[ApiController]
[Route("[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;

    public UserController(IUserService userService)
    {
        _userService = userService;
    }
    
    [HttpGet]
    public async Task<IActionResult> GetAll()
    {
        var users = await _userService.GetAll();
        return Ok(users);
    }

    [HttpGet("{id:guid}")]
    public async Task<IActionResult> GetById(Guid id)
    {
        var user = await _userService.GetById(id);
        if (user == null)
            return NotFound();

        return Ok(user);
    }

    [HttpPut("{id:guid}")]
    public async Task<IActionResult> Update(Guid id)
    {
        var success = await _userService.Update(id);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{id:guid}")]
    public async Task<IActionResult> Delete(Guid id)
    {
        var success = await _userService.Delete(id);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpGet("{userId:guid}/lists")]
    public async Task<IActionResult> GetUserLists(Guid userId)
    {
        var lists = await _userService.GetUserLists(userId);

        if (lists == null)
            return NotFound("User not found.");

        return Ok(lists);
    }

    [HttpPost("{userId:guid}/lists")]
    public async Task<IActionResult> CreateUserList(Guid userId)
    {
        var created = await _userService.CreateUserList(userId);

        if (created == null)
            return NotFound("User not found.");

        return CreatedAtAction(nameof(GetUserLists), new { userId }, created);
    }

    [HttpPut("{userId:guid}/lists/{listId:int}")]
    public async Task<IActionResult> UpdateUserList(Guid userId, int listId)
    {
        var success = await _userService.UpdateUserList(userId, listId);
        if (!success)
            return NotFound();

        return NoContent();
    }

    [HttpDelete("{userId:guid}/lists/{listId:int}")]
    public async Task<IActionResult> DeleteUserList(Guid userId, int listId)
    {
        var success = await _userService.DeleteUserList(userId, listId);
        if (!success)
            return NotFound();

        return NoContent();
    }
}
