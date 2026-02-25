using System.Security.Claims;
using Api.DTOs;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("api/[controller]")]
[Authorize]
public class ListsController : ControllerBase
{
    private readonly IUserListRepository _userListRepository;
    private readonly IUserShowEntryRepository _userShowEntryRepository;
    private readonly IUserRepository _userRepository;

    public ListsController(IUserListRepository userListRepository, IUserShowEntryRepository userShowEntryRepository, IUserRepository userRepository)
    {
        _userListRepository = userListRepository;
        _userShowEntryRepository = userShowEntryRepository;
        _userRepository = userRepository;
    }

    private string? GetCurrentUserId()
    {
        return User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
    }

    [HttpGet]
    public async Task<IActionResult> GetLists()
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var lists = await _userListRepository.GetByUserId(userId);
        return Ok(lists);
    }
    
    [HttpGet("public")]
    public async Task<IActionResult> GetPublicLists()
    {
        var lists = await _userListRepository.GetAllPublic();
        return Ok(lists);
    }

    [HttpPost]
    public async Task<IActionResult> CreateList([FromBody] CreateUserListDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();
        
        var now = DateTime.UtcNow;
        var userList = new UserList
        {
            Name = dto.Name,
            Type = dto.Type,
            IsPublic = dto.IsPublic,
            CreatedAt = now,
            UpdatedAt = now,
            UserId = userId
        };

        // Handle initial items if provided
        if (dto.Items != null && dto.Items.Any())
        {
            foreach (var itemDto in dto.Items)
            {
                userList.UserShowEntryList.Add(new UserShowEntry
                {
                    TVShowId = itemDto.TvShowId,
                    Status = itemDto.Status,
                    Rating = itemDto.Rating ?? 0, // default if null
                    LoggedAt = now,
                    Position = 0 // Default position
                });
            }
        }

        var created = await _userListRepository.Create(userList);
        
        return CreatedAtAction(nameof(GetList), new { id = created.Id }, created);
    }

    [HttpGet("{id}")]
    public async Task<IActionResult> GetList(int id)
    {
        var userId = GetCurrentUserId();
        var list = await _userListRepository.Read(id);

        if (list == null) return NotFound();

        // Access control: Owner or Public
        if (list.UserId != userId && !list.IsPublic)
        {
            return Forbid();
        }

        return Ok(list);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> UpdateList(int id, [FromBody] UpdateUserListDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var existingList = await _userListRepository.Read(id);
        if (existingList == null) return NotFound();

        if (existingList.UserId != userId) return Forbid();

        if (dto.Name != null) existingList.Name = dto.Name;
        if (dto.Type.HasValue) existingList.Type = dto.Type.Value;
        if (dto.IsPublic.HasValue) existingList.IsPublic = dto.IsPublic.Value;
        
        existingList.UpdatedAt = DateTime.UtcNow;

        var success = await _userListRepository.Update(id, existingList);
        if (!success) return StatusCode(500, "Failed to update list");

        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteList(int id)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var existingList = await _userListRepository.Read(id);
        if (existingList == null) return NotFound();

        if (existingList.UserId != userId) return Forbid();

        var success = await _userListRepository.Delete(id);
        if (!success) return StatusCode(500, "Failed to delete list");

        return NoContent();
    }
    
    [HttpGet("{id}/items/{itemId}")]
    public async Task<ActionResult<UserShowEntry>> GetById(int itemId)
    {
        var item = await _userShowEntryRepository.Read(itemId);
        if (item == null)
            return NotFound();
        return Ok(item);
    }

    [HttpPost("{id}/items")]
    public async Task<IActionResult> AddItem(int id, [FromBody] CreateListEntryDto itemDto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var list = await _userListRepository.Read(id);
        if (list == null) return NotFound("List not found");

        if (list.UserId != userId) return Forbid();

        var exists = await _userShowEntryRepository.ExistsInList(id, itemDto.TvShowId);
        if (exists)
            return Conflict("TV show is already in this list.");

        var entry = new UserShowEntry
        {
            UserListId = id,
            TVShowId = itemDto.TvShowId,
            Status = itemDto.Status,
            Rating = itemDto.Rating ?? 1,
            LoggedAt = DateTime.UtcNow
        };

        await _userShowEntryRepository.Create(entry);
        
        return Ok(entry);
    }

    [HttpPut("{id}/items/{itemId}")]
    public async Task<IActionResult> UpdateItem(int itemId, [FromBody] UpdateListEntryDto dto)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        var existingItem = await _userShowEntryRepository.Read(itemId);
        if (existingItem == null) return NotFound();

        if (dto.Status.HasValue) existingItem.Status = dto.Status.Value;
        if (dto.Rating.HasValue) existingItem.Rating = dto.Rating.Value;

        var success = await _userShowEntryRepository.Update(itemId, existingItem);
        if (!success) return StatusCode(500, "Failed to update item");

        return NoContent();
    }

    [HttpDelete("{id}/items/{itemId}")]
    public async Task<IActionResult> RemoveItem(int id, int itemId)
    {
        var userId = GetCurrentUserId();
        if (userId == null) return Unauthorized();

        // 1. Check list ownership
        var list = await _userListRepository.Read(id);
        if (list == null) return NotFound("List not found");

        if (list.UserId != userId) return Forbid();

        // 2. Check item exists
        var item = await _userShowEntryRepository.Read(itemId);
        if (item == null) return NotFound("Item not found");
        
        // 3. Verify item belongs to list
        if (item.UserListId != id) return BadRequest("Item does not belong to this list");

        // 4. Delete item
        var success = await _userShowEntryRepository.Delete(itemId);
        if (!success) return StatusCode(500, "Failed to delete item");

        return NoContent();
    }
}
