namespace Api.DTOs;

public class AuthResponseDto
{
    public string Token { get; set; }
    public int ExpiresIn { get; set; }

    public AuthResponseDto(string token, int expiresIn)
    {
        Token = token;
        ExpiresIn = expiresIn;
    }
}
