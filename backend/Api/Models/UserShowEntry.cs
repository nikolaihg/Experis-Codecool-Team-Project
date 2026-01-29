using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class UserShowEntry
{
    public Guid Id { get; set; }

    public UserWatchStatus Status { get; set; }

    public int Rating { get; set; }

    public DateTime LoggedAt { get; set; }

    public int Position { get; set; }
    
    [Required] // FK to userlist, I don't know if this is necessary
    public Guid UserListId { get; set; }
    public UserList UserList { get; set; } 

    [Required] // FK to tvshow, I don't know if this is necessary
    public Guid TVShowId { get; set; }
    public TVShow TVShow { get; set; }
}
