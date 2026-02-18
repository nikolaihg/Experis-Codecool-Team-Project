using System.ComponentModel.DataAnnotations;

namespace Api.Models;

public class TVShow
{
    public int Id { get; set; }

    [Required]
    [MaxLength(200)]
    public string Title { get; set; } 
    
    [MaxLength(2000)]
    public string Description { get; set; } 

    public int ReleaseYear { get; set; }

    [MaxLength(500)]
    public string PosterUrl { get; set; }

    public TVShowStatus Status { get; set; }
    public DateTime CreatedAt { get; set; }

    public string Genre { get; set; }
    public double ImdbRating { get; set; }
    public int AmountOfEpisodes { get; set; }
    public int TotalUsersWatched { get; set; }
}
