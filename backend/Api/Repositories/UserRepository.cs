using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _context;
    
    public UserRepository(AppDbContext context)
    {
        _context = context;
    }
    
    public async Task<IEnumerable<User>> GetAll()
    {
        return await _context.Users.AsNoTracking().ToListAsync();
    }
    
    public async Task<User> Create(User item)
    {
        await _context.Users.AddAsync(item);
        await _context.SaveChangesAsync();
        return item;
    }
    
    public Task<User?> Read(string id)
    {
        return _context.Users.Include(u => u.UserLists).FirstOrDefaultAsync(u => u.Id == id);
    }    
    public async Task<bool> Update(string Id, User item)
    {
        var existing = await _context.Users.FirstOrDefaultAsync(u => u.Id == Id);
        
        //Add more changes depending on what user contains
        existing.UserName = item.UserName;
        
        var affected  = await _context.SaveChangesAsync();
        return affected > 0;
    }
    
    public async Task<bool> Delete(string id)
    {
        var _user = await _context.Users.FirstOrDefaultAsync(u => u.Id == id);
        _context.Remove(_user);
        var affected  = await _context.SaveChangesAsync();
        return affected > 0;
    }
    

}