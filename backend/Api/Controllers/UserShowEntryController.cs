using Api.DTOs;
using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;

[ApiController]
[Route("users/{userId}/lists/{listId:int}/entries")]
[Authorize]
public class UserShowEntryController : ControllerBase
{
    private readonly IUserListRepository _userListRepository;
    private readonly ITVShowRepository _tvShowRepository;
    private readonly IUserShowEntryRepository _userShowEntryRepository;

    public UserShowEntryController(
        IUserListRepository userListRepository,
        ITVShowRepository tvShowRepository,
        IUserShowEntryRepository userShowEntryRepository)
    {
        _userListRepository = userListRepository;
        _tvShowRepository = tvShowRepository;
        _userShowEntryRepository = userShowEntryRepository;
    }

    [HttpPost]
    [Authorize(Roles = "User")]
    public async Task<IActionResult> Create(string userId, int listId, [FromBody] CreateUserShowEntryDto dto)
    {
        var list = await _userListRepository.Read(listId);
        if (list == null || list.UserId != userId)
            return NotFound("User list not found.");

        var tvShow = await _tvShowRepository.Read(dto.TVShowId);
        if (tvShow == null)
            return NotFound("TV show not found.");

        var status = UserWatchStatus.Planning;
        if (!string.IsNullOrWhiteSpace(dto.Status))
        {
            if (!Enum.TryParse(dto.Status, true, out status))
                return BadRequest("Invalid status.");
        }

        if (dto.Rating.HasValue && (dto.Rating.Value < 0 || dto.Rating.Value > 5))
            return BadRequest("Rating must be between 0 and 5.");

        if (dto.Position.HasValue && dto.Position.Value < 0)
            return BadRequest("Position must be 0 or higher.");

        var entry = new UserShowEntry
        {
            UserListId = list.Id,
            TVShowId = tvShow.Id,
            Status = status,
            Rating = dto.Rating ?? 0,
            LoggedAt = DateTime.UtcNow
        };

        var created = await _userShowEntryRepository.Create(entry);

        return Created($"/users/{userId}/lists/{listId}/entries/{created.Id}", new
        {
            created.Id,
            created.UserListId,
            created.TVShowId,
            created.Status,
            created.Rating,
            created.LoggedAt
        });
    }
}
