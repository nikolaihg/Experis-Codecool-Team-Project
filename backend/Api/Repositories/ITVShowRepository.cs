using Api.Models;

namespace Api.Repositories;

public interface ITVShowRepository : IRepository<TVShow, int>
{
    Task<IEnumerable<TVShow>> Search(string q);
}