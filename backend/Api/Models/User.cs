using System.ComponentModel.DataAnnotations;
using Microsoft.AspNetCore.Identity;

namespace Api.Models;

public class User : IdentityUser
{
    [Required]
    [MaxLength(50)]
    public string Username { get; set; }
    
    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Boolean IsActive { get; set; }

    public ICollection<UserList> UserLists { get; set; } = new List<UserList>();
}
