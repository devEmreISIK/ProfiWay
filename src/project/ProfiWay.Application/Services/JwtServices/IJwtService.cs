

using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.JwtServices;

public interface IJwtService
{
    Task<AccessTokenDTO> CreateTokenAsync(User user);
}
