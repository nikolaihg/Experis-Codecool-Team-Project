using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class TVShow
{
    public Guid Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } 
    
    [MaxLength(2000)]
    public string Description { get; set; } 

    public int ReleaseYear { get; set; }

    [MaxLength(500)]
    public string PosterUrl { get; set; }

    public TVShowStatus Status { get; set; }
    public Boolean IsArchived { get; set; }
    public DateTime CreatedAt { get; set; }

    public ICollection<UserShowEntry> UserShowEntryList { get; set; } = new List<UserShowEntry>();
}
