

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.UserRoles.Commands.Update;

public class UserRoleUpdateCommand : IRequest<string>
{
    public string UserId { get; set; }
    public string NewRoleId { get; set; }

    public class UserRoleUpdateCommandHandler : IRequestHandler<UserRoleUpdateCommand, string>
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRoleUpdateCommandHandler(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task<string> Handle(UserRoleUpdateCommand request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.UserId);
            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            IdentityRole? newRole = await _roleManager.FindByIdAsync(request.NewRoleId);

            if (newRole is null)
            {
                throw new NotFoundException("Role not found.");
            }

            var currentRole = await _userManager.GetRolesAsync(user);

            if (currentRole.Any())
            {
                IdentityResult removeResult = await _userManager.RemoveFromRolesAsync(user, currentRole);

                if (!removeResult.Succeeded)
                {
                    var errors = removeResult.Errors.Select(x => x.Description).ToList();
                    throw new AuthorizationException(errors);
                }

                IdentityResult addResult = await _userManager.AddToRoleAsync(user, newRole.Name);

                if (!addResult.Succeeded)
                {
                    var errors = addResult.Errors.Select(x => x.Description).ToList();
                    throw new AuthorizationException(errors);
                }         
            }

            return $"Success {newRole.Name} role added to the user.";
        }
    }
}
