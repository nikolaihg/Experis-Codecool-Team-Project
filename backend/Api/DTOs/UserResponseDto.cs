namespace Api.DTOs;

public record UserResponseDto
{
    public string Id { get; init; }
    public string Email { get; init; }
    public string UserName { get; init; }
    public DateTime CreatedAt { get; init; }
    public DateTime UpdatedAt { get; init; }
    public bool IsActive { get; init; }
}
