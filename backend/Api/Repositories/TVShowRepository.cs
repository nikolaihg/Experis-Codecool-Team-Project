using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class TVShowRepository : ITVShowRepository
{
    private readonly AppDbContext _context;

    public TVShowRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<TVShow>> GetAll()
    {
        return await _context.TVShows.AsNoTracking().ToListAsync();
    }

    public async Task<TVShow> Create(TVShow item)
    {
        await _context.TVShows.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<TVShow?> Read(int id)
    {
        return await _context.TVShows.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> Update(int id, TVShow item)
    {
        var existing = await _context.TVShows.FirstOrDefaultAsync(x => x.Id == id);
        
        existing.Title = item.Title;
        existing.Description = item.Description;
        existing.ReleaseDate = item.ReleaseDate;
        existing.Genre = item.Genre;
        existing.Rating = item.Rating;
        existing.AmountOfEpisodes = item.AmountOfEpisodes;
        existing.TotalUsersWatched = item.TotalUsersWatched;
        
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Delete(int id)
    {
        var item = await _context.TVShows.FirstOrDefaultAsync(x => x.Id == id);
        _context.Remove(item);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<IEnumerable<TVShow>> Search(string q)
    {
        return await _context.TVShows
            .Where(s => EF.Functions.ILike(s.Title, $"%{q}%"))
            .OrderBy(s => s.Title)
            .Take(5)
            .ToListAsync();
    }
}