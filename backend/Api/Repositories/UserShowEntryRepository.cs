using Api.Data;
using Api.Models;

namespace Api.Repositories;

public class UserShowEntryRepository
{
    private readonly AppDbContext _context;
    
    public UserShowEntryRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<UserShowEntry>> GetAll()
    {
        return await _context.UserShowEntrys.AsNoTracking().ToListAsync();
    }

    public async Task<UserShowEntry> Create(UserShowEntry item)
    {
        await _context.UserShowEntrys.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<UserShowEntry?> Read(int id)
    {
        return await _context.UserShowEntrys.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> Update(int id, UserShowEntry item)
    {
        var existing = await _context.UserShowEntrys.FirstOrDefaultAsync(x => x.Id == id);
        
        existing.Status = item.Status;
        existing.Rating = item.Rating;
        existing.LoggedAt = item.LoggedAt;
        existing.Position = item.Position;
        
        existing.UserListId = item.UserListId;
        existing.UserList =  item.UserList;
        
        existing.TVShowId = item.TVShowId;
        existing.TVShow = item.TVShow;
        
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Delete(int id)
    {
        var item = await _context.UserShowEntrys.FirstOrDefaultAsync(x => x.Id == id);
        _context.Remove(item);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }
}