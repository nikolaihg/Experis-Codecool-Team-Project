using Api.Models;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;

namespace Api.Data;

public class AppDbContext : IdentityDbContext<User>
{
    public DbSet<User> Users { get; set; }
}