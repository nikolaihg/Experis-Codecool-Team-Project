using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class UserShowEntryRepository : IUserShowEntryRepository
{
    private readonly AppDbContext _context;
    
    public UserShowEntryRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<UserShowEntry>> GetAll()
    {
        return await _context.UserShowEntries.AsNoTracking().ToListAsync();
    }

    public async Task<UserShowEntry> Create(UserShowEntry item)
    {
        await _context.UserShowEntries.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<UserShowEntry?> Read(int id)
    {
        return await _context.UserShowEntries.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> ExistsInList(int userListId, int tvShowId)
    {
        return await _context.UserShowEntries
            .AnyAsync(entry => entry.UserListId == userListId && entry.TVShowId == tvShowId);
    }

    public async Task<bool> Update(int id, UserShowEntry item)
    {
        var existing = await _context.UserShowEntries.FirstOrDefaultAsync(x => x.Id == id);
        
        existing.Status = item.Status;
        existing.Rating = item.Rating;
        
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Delete(int id)
    {
        var item = await _context.UserShowEntries.FirstOrDefaultAsync(x => x.Id == id);
        _context.Remove(item);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }
}