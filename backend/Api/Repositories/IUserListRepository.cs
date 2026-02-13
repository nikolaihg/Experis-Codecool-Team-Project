using Api.Models;

namespace Api.Repositories;

public interface IUserListRepository : IRepository<UserList, int>
{
<<<<<<< HEAD
    Task<IEnumerable<UserList>> GetByUserId(string userId);
    Task<IEnumerable<UserList>> GetAllPublic();
    Task<bool> Add(int id, UserShowEntry entry);
=======
    Task<bool> Add(int id, UserShowEntry entry);
    
>>>>>>> e4b7b32 (Believe everything works, but cannot check since the movies in the database doesn't match the site. Will rebase to try and fix this)
}