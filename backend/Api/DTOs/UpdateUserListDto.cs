using System.ComponentModel.DataAnnotations;
using Api.Models;

namespace Api.DTOs;

public class UpdateUserListDto
{
    [MaxLength(100)]
    public string? Name { get; set; }

    public ListType? Type { get; set; }

    public bool? IsPublic { get; set; }
}

public class UpdateListEntryDto 
{
    public UserWatchStatus? Status { get; set; }
    public int? Rating { get; set; }
}
