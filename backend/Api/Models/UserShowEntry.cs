using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class UserShowEntry
{
    public int Id { get; set; }

    public UserWatchStatus Status { get; set; }

    [Range(1, 6)]
    public int? Rating { get; set; }

    public DateTime LoggedAt { get; set; }
    
    [Required] // FK to userlist
    public int UserListId { get; set; }

    [Required] // FK to tvshow
    public int TVShowId { get; set; }
}
