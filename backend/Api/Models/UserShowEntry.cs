using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class UserShowEntry
{
    public int Id { get; set; }

    public UserWatchStatus Status { get; set; }

    public int Rating { get; set; }

    public DateTime LoggedAt { get; set; }

    public int Position { get; set; }
    
    [Required] // FK to userlist
    public int UserListId { get; set; }
    public UserList UserList { get; set; } 

    [Required] // FK to tvshow
    public int TVShowId { get; set; }
    public TVShow TVShow { get; set; }
}
