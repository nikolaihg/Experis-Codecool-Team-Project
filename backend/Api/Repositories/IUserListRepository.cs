using Api.Models;

namespace Api.Repositories;

public interface IUserListRepository : IRepository<UserList, int>
{
    Task<bool> Add(int id, UserShowEntry entry);
    
}