using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class User : IdentityUser
{
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Boolean IsActive { get; set; }

    public ICollection<UserList> UserLists { get; set; } = new List<UserList>();
}
