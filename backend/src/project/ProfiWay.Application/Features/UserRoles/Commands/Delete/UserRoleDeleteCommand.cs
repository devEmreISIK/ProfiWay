

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.UserRoles.Commands.Delete;

public class UserRoleDeleteCommand : IRequest<string>
{
    public string UserId { get; set; }

    public class UserRoleDeleteCommandHandler : IRequestHandler<UserRoleDeleteCommand, string>
    {
        private readonly UserManager<User> _userManager;

        public UserRoleDeleteCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<string> Handle(UserRoleDeleteCommand request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.UserId);

            if (user is null)
            {
                throw new NotFoundException("User not found.");
            }

            var userRoles = await _userManager.GetRolesAsync(user);

            if (!userRoles.Any())
            {
                throw new NotFoundException("User not found.");
            }

            IdentityResult removeResult = await _userManager.RemoveFromRolesAsync(user, userRoles);

            if (!removeResult.Succeeded)
            {
                var errors = removeResult.Errors.Select(x => x.Description).ToList();
                throw new AuthorizationException(errors);
            }

            return "User role removed.";
        }
    }
}
