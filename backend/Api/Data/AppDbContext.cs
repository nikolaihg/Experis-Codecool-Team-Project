using Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext(DbContextOptions<AppDbContext> options) : IdentityDbContext<User>(options)
{
    public DbSet<User> Users { get; set; }
    public DbSet<TVShow> TVShows {get; set;}
    public DbSet<UserList> UserLists {get; set;}
    public DbSet<UserShowEntry> UserShowEntries {get; set;}
    
}