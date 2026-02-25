using Api.Models;

namespace Api.Repositories;

public interface IUserShowEntryRepository : IRepository<UserShowEntry, int>
{
	Task<bool> ExistsInList(int userListId, int tvShowId);
}