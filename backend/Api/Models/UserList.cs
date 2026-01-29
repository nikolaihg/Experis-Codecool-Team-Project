using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class UserList
{
    public int Id { get; set; }
    
    [Required]
    [MaxLength(100)]
    public string Name { get; set; }

    public ListType Type { get; set; }

    public Boolean IsPublic { get; set; }

    public DateTime CreatedAt { get; set; }
    public DateTime UpdatedAt { get; set; }

    [Required] //FK to user
    public string UserId { get; set; }
    public User User { get; set; } 

    public ICollection<UserShowEntry> UserShowEntryList { get; set; } = new List<UserShowEntry>();
}
