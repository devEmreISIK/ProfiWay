

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Application.Services.JwtServices;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Authentication.Register.Commands;

public class RegisterCommand : IRequest<AccessTokenDTO>
{
    public string UserName { get; set; }
    public string FullName { get; set; }
    public string Email { get; set; }
    public bool IsJobSeeker { get; set; }
    public string Password { get; set; }


    public class RegisterCommandHandler : IRequestHandler<RegisterCommand, AccessTokenDTO>
    {
        private readonly UserManager<User> _userManager;
        private readonly IJwtService _jwtService;

        public RegisterCommandHandler(UserManager<User> userManager, IJwtService jwtService)
        {
            _userManager = userManager;
            _jwtService = jwtService;
        }

        public async Task<AccessTokenDTO> Handle(RegisterCommand request, CancellationToken cancellationToken)
        {
            User user = new User()
            {
                UserName = request.UserName,
                FullName = request.FullName,
                Email = request.Email,
                IsJobSeeker = request.IsJobSeeker,
            };

            var emailUserCheck = await _userManager.FindByEmailAsync(request.Email);

            if (emailUserCheck is not null)
            {
                throw new BusinessException("Email should be unique.");
            }

            IdentityResult result = await _userManager.CreateAsync(user, request.Password);

            if (!result.Succeeded)
            {
                var errors = result.Errors.Select(x => x.Description).ToList();
                throw new AuthorizationException(errors);
            }

            // AccessTokenDTO token = await _jwtService.CreateTokenAsync(emailUserCheck);
            AccessTokenDTO token = await _jwtService.CreateTokenAsync(user);

            return token;
        }
    }
}
