using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class User : IdentityUser
{
    UserRole UserRole;
    public int Id { get; }
    
    public User()
    {
        UserRole = UserRole.User;
    }
}