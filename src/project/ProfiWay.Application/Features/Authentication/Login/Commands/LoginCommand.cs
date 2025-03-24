

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Application.Services.JwtServices;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Authentication.Login.Commands;

public class LoginCommand : IRequest<AccessTokenDTO>
{
    public string Email { get; set; }
    public string Password { get; set; }

    public class LoginCommandHandler : IRequestHandler<LoginCommand, AccessTokenDTO>
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtService _jwtService;

        public LoginCommandHandler(UserManager<User> userManager, IJwtService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }

        public async Task<AccessTokenDTO> Handle(LoginCommand request, CancellationToken cancellationToken)
        {
            var emailUser = await _userManager.FindByEmailAsync(request.Email);

            if (emailUser is null)
            {
                throw new NotFoundException("Email address is not registered.");
            }

            AccessTokenDTO token = await _jwtService.CreateTokenAsync(emailUser);

            return token;
        }
    }
}
