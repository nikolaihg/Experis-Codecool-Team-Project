using Api.Data;
using Api.Models;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class UserListRepository : IUserListRepository
{
    private readonly AppDbContext _context;
    
    public UserListRepository(AppDbContext context)
    {
        _context = context;
    }
    
     
    public async Task<IEnumerable<UserList>> GetAll()
    {
        return await _context.UserLists.AsNoTracking().ToListAsync();
    }

    public async Task<UserList> Create(UserList item)
    {
        await _context.UserLists.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }

    public async Task<UserList?> Read(int id)
    {
        return await _context.UserLists.FirstOrDefaultAsync(c => c.Id == id);
    }

    public async Task<bool> Update(int id, UserList item)
    {        
        var existing = await _context.UserLists.FirstOrDefaultAsync(x => x.Id == id);
        if (existing == null)
            return false;

        existing.Name = item.Name;
        existing.UpdatedAt = DateTime.Now;

        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Add(int id, UserShowEntry entry)
    {
        var existing = await _context.UserLists.FirstOrDefaultAsync(x => x.Id == id);
        
        if(existing == null)
        {
            Console.WriteLine("UserList not found");
            return false;
        }
        
        Console.WriteLine("TVshowID:" + entry.TVShowId);
        entry.LoggedAt = DateTime.UtcNow;

        Console.WriteLine($"Checking if TVShow with ID {entry.TVShowId} exists in TVShows table"); // Debug log
        var showExists = _context.TVShows.Any(s => s.Id == entry.TVShowId);
        if (!showExists)
        {
        throw new Exception("TVShowId does not exist in TVShows table.");
        }

        existing.UserShowEntryList.Add(entry);

        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Delete(int id)
    {
        var item = await _context.UserLists.FirstOrDefaultAsync(x => x.Id == id);
        if (item == null)
        {
            Console.WriteLine("UserList not found");
            return false;
        }
        _context.Remove(item);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

}