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
        
        existing.Name = item.Name;
        existing.Type = item.Type;
        existing.IsPublic = item.IsPublic;
        existing.CreatedAt = item.CreatedAt;
        existing.UpdatedAt = DateTime.Now;
        
        existing.UserId = item.UserId;
        existing.User =  item.User;
        
        existing.UserShowEntryList = item.UserShowEntryList;
        
        
        
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

    public async Task<bool> Delete(int id)
    {
        var item = await _context.UserLists.FirstOrDefaultAsync(x => x.Id == id);
        _context.Remove(item);
        var affected = await _context.SaveChangesAsync();
        return affected > 0;
    }

}