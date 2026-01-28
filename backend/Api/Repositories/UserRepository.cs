using Api.Data;
using Api.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace Api.Repositories;

public class UserRepository : IUserRepository
{
    private readonly AppDbContext _dbContext;
    
    public UserRepository(AppDbContext dbContext)
    {
        _dbContext = dbContext;
    }
    
    public Task<IEnumerable<User>> GetAll()
    {
        throw new NotImplementedException();
    }
    
    public async Task<User> Create(User item)
    {
        await _dbContext.Users.AddAsync(item);
        return item;
    }
    
    public Task<User?> Read(int id)
    {
        return _dbContext.Users.FirstOrDefaultAsync(user => user.Id == id);
    }
    
    public Task<bool> Delete(int id)
    {
        var _user = _dbContext.Users.Find(id);
        _dbContext.Users.Remove(_user);
        return Task.FromResult(true);
    }
    
    public Task<bool> Update(int Id, User item)
    {
        throw new NotImplementedException();
    }
}