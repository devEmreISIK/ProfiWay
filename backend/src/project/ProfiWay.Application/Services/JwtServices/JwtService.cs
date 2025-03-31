using Microsoft.AspNetCore.Identity;
using Microsoft.Extensions.Options;
using Microsoft.IdentityModel.Tokens;
using ProfiWay.Domain.Entities;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace ProfiWay.Application.Services.JwtServices;

public class JwtService : IJwtService
{
    private readonly UserManager<User> _userManager;
    private readonly CustomTokenOptions _customTokenOptions;

    public JwtService(UserManager<User> userManager, IOptions<CustomTokenOptions> options)
    {
        _userManager = userManager;
        _customTokenOptions = options.Value;
    }

    public async Task<AccessTokenDTO> CreateTokenAsync(User user)
    {
        var accessTokenExpiration = DateTime.Now.AddMinutes(_customTokenOptions.AccessTokenExpiration);
        var symmetricKey = GetSecurityKey(_customTokenOptions.SecurityKey);

        SigningCredentials signingCredentials = new SigningCredentials(symmetricKey, SecurityAlgorithms.HmacSha512Signature);

        JwtSecurityToken jwt = new JwtSecurityToken(
            issuer: _customTokenOptions.Issuer,
            audience: _customTokenOptions.Audience[0],
            expires: accessTokenExpiration,
            signingCredentials: signingCredentials,
            claims: await GetClaims(user)
            );

        var jwtHandler = new JwtSecurityTokenHandler();

        string token = jwtHandler.WriteToken(jwt);

        AccessTokenDTO accessTokenDTO = new AccessTokenDTO
        {
            Token = token,
            TokenExpiration = accessTokenExpiration,
        };

        return accessTokenDTO;
    }

    private async Task<List<Claim>> GetClaims(User user)
    {
        var claimList = new List<Claim>()
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id),
            new Claim("Email", user.Email),
        };

        var roles = await _userManager.GetRolesAsync(user);

        if (roles.Count > 0)
        {
            claimList.AddRange(roles.Select(x => new Claim(ClaimTypes.Role, x)));
        }

        return claimList;
    }

    private SecurityKey GetSecurityKey(string key)
    {
        return new SymmetricSecurityKey(Encoding.UTF8.GetBytes(key));
    }
}
