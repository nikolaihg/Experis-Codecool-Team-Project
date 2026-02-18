using Api.Models;

namespace Api.DTOs;

public class CreateUserListDto
{
    public string Name { get; set; }
    public ListType Type { get; set; }
    public bool IsPublic { get; set; }
    
    // Optional: Allow creating a list with initial items
    public List<CreateListEntryDto>? Items { get; set; }
}

public class CreateListEntryDto 
{
    public int TvShowId { get; set; }
    public UserWatchStatus Status { get; set; }
    public int? Rating { get; set; }
}
