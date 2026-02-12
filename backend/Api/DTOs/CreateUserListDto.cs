using Api.Models;

namespace Api.DTOs;

public class CreateUserListDto
{
    public string Name { get; set; }
    public ListType Type { get; set; }
    public bool IsPublic { get; set; }
}
