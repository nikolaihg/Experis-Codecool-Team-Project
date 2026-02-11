using Api.Models;
using Api.Repositories;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace Api.Controllers;


[ApiController]
[Route("api/[controller]")]
[Authorize]
public class TVShowController : ControllerBase
{
    private readonly ILogger<TVShowController> _logger;
    private readonly ITVShowRepository _tvShowRepository;
    
    public TVShowController(ILogger<TVShowController> logger, ITVShowRepository tvShowRepository)
    {
        _logger = logger;
        _tvShowRepository = tvShowRepository;
    }
    
    [HttpGet()]
    [Authorize]
    public async Task<ActionResult<IEnumerable<TVShow>>> GetAll()
    {
        var tvShows = await _tvShowRepository.GetAll();
        return Ok(tvShows);
    }
    
    [HttpGet("{id}")]
    [Authorize]
    public async Task<ActionResult<TVShow>> GetById(int id)
    {
        var tvShow = await _tvShowRepository.Read(id);
        if (tvShow == null)
            return NotFound();
        return Ok(tvShow);
    }

    [HttpPost()]
    [Authorize(Roles = "Admin")]
    public async Task Create(TVShow item)
    {
        await _tvShowRepository.Create(item);
    }
    
    [HttpPut("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Update(int id, TVShow item)
    {
        var updated = await _tvShowRepository.Update(id, item);
        if (!updated)
            return NotFound();
        return Ok();
    }
    
    [HttpDelete("{id}")]
    [Authorize(Roles = "Admin")]
    public async Task<ActionResult> Delete(int id)
    {
        var deleted = await _tvShowRepository.Delete(id);
        if (!deleted) 
            return NotFound();
        return Ok();
    }
    
    
}