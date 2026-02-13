using Api.Models;

namespace Api.Repositories;

public interface IUserListRepository : IRepository<UserList, int>
{
    Task<IEnumerable<UserList>> GetByUserId(string userId);
    Task<IEnumerable<UserList>> GetAllPublic();
    Task<bool> Add(int id, UserShowEntry entry);
}