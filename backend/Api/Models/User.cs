using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class User
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(320)]
    public string Email { get; set; }
    
    [Required]
    [MaxLength(200)]
    public string PasswordHash { get; set; }
    
    [Required]
    [MaxLength(50)]
    public string Username { get; set; }

    public UserRole Role { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    public Boolean IsActive { get; set; }

    public ICollection<UserList> UserLists { get; set; } = new List<UserList>();
}
