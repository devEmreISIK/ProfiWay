
using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace ProfiWay.Application.Features.Roles.Commands.Delete;

public class RoleDeleteCommand : IRequest<string>
{
    public string Id { get; set; }

    public class RoleDeleteCommandHandler : IRequestHandler<RoleDeleteCommand, string>
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleDeleteCommandHandler(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<string> Handle(RoleDeleteCommand request, CancellationToken cancellationToken)
        {
            var existingRole = await _roleManager.FindByIdAsync(request.Id);
            if (existingRole == null)
            {
                throw new BusinessException("Role does not exist.");
            }

            var result = await _roleManager.DeleteAsync(existingRole);
            if (!result.Succeeded)
            {
                throw new BusinessException("Role deletion failed.");
            }

            return "Success!";
        }
    }
}
