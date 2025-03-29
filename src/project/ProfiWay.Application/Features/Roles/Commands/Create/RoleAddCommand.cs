

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace ProfiWay.Application.Features.Roles.Commands.Create;

public class RoleAddCommand : IRequest<string>
{
    public string Name { get; set; }

    public class RoleAddCommandHandler : IRequestHandler<RoleAddCommand, string>
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleAddCommandHandler(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<string> Handle(RoleAddCommand request, CancellationToken cancellationToken)
        {
            bool roleIsPresent = await _roleManager.RoleExistsAsync(request.Name);

            if (roleIsPresent)
            {
                throw new BusinessException("Role should be unique");
            }

            IdentityRole role = new IdentityRole()
            {
                Name = request.Name,
            };

            await _roleManager.CreateAsync(role);

            return "Success!";
        }
    }
}
