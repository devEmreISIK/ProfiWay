

namespace ProfiWay.Application.Services.JwtServices;

public class AccessTokenDTO
{
    public string Token { get; set; }
    public DateTime TokenExpiration { get; set; }
}
