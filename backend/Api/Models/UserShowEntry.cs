using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class UserShowEntry
{
    public int Id { get; set; }

    public UserWatchStatus Status { get; set; }

    [Range(1, 10)]
    public int? Rating { get; set; }

    public DateTime LoggedAt { get; set; }

    public int Position { get; set; }
    
    [Required]
    public int UserListId { get; set; }
    public UserList UserList { get; set; } 

    [Required]
    public int TVShowId { get; set; }
    public TVShow TVShow { get; set; }
}
