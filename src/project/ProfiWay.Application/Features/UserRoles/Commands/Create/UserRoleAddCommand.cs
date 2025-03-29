

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.UserRoles.Commands.Create;

public class UserRoleAddCommand : IRequest<string>
{
    public string UserId { get; set; }
    public string RoleId { get; set; }

    public class UserRoleAddCommandHandler : IRequestHandler<UserRoleAddCommand, string>
    {
        private readonly UserManager<User> _userManager;
        private readonly RoleManager<IdentityRole> _roleManager;

        public UserRoleAddCommandHandler(UserManager<User> userManager, RoleManager<IdentityRole> roleManager)
        {
            _userManager = userManager;
            _roleManager = roleManager;
        }
        public async Task<string> Handle(UserRoleAddCommand request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.UserId);

            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            IdentityRole? role = await _roleManager.FindByIdAsync(request.RoleId);

            if (role is null)
            {
                throw new NotFoundException("Role not found.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            if (userRoles.Any())
            {
                var roleIsExist = userRoles.Any(x => x == role.Name);

                if (roleIsExist)
                {
                    throw new BusinessException("This role is already exists for this user.");
                }

                IdentityResult removeResult = await _userManager.RemoveFromRolesAsync(user, userRoles);
                if (!removeResult.Succeeded)
                {
                    var errors = removeResult.Errors.Select(x => x.Description).ToList();
                    throw new AuthorizationException(errors);
                }
            }

            

            IdentityResult addRoleResult = await _userManager.AddToRoleAsync(user, role.Name);

            if (!addRoleResult.Succeeded)
            {
                var errors = addRoleResult.Errors.Select(x => x.Description).ToList();

                throw new AuthorizationException(errors);
            }

            return "New role added to user.";
        }
    }
}
