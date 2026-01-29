using System.ComponentModel.DataAnnotations;

namespace Api.DTOs;

public record UserDto
{
    
    [Required, MaxLength(50)]
    public string Username { get; set; }
    
    [Required, EmailAddress]
    public string Email { get; init; }
    
    [Required, MinLength(8)]
    public string Password { get; init; }
}