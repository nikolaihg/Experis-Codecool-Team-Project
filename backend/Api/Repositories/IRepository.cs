namespace Api.Repositories;

public interface IRepository<T, in TK>
{
    Task <IEnumerable<T>> GetAll();
    Task<T> Create(T item);
    Task<T?> Read(TK id);
    Task<bool> Update(TK id, T item);
    Task<bool> Delete(TK id);
}