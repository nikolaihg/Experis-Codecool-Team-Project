using System.ComponentModel.DataAnnotations;

namespace Api.DTOs;

public class CreateUserShowEntryDto
{
    [Required]
    public int TVShowId { get; set; }

    public string? Status { get; set; }

    [Range(0, 5)]
    public int? Rating { get; set; }

    [Range(0, int.MaxValue)]
    public int? Position { get; set; }
}
