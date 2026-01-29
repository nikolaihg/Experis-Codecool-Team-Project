using Microsoft.AspNetCore.Identity;

namespace Api.Services;

public interface IJwtService
{
    string GenerateToken(IdentityUser user, IEnumerable<string> roles);
}