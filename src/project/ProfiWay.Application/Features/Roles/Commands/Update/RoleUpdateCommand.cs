

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace ProfiWay.Application.Features.Roles.Commands.Update;

public class RoleUpdateCommand : IRequest<IdentityRole>
{
    public string Id { get; set; }
    public string Name { get; set; }

    public class RoleUpdateCommandHandler : IRequestHandler<RoleUpdateCommand, IdentityRole>
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RoleUpdateCommandHandler(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<IdentityRole> Handle(RoleUpdateCommand request, CancellationToken cancellationToken)
        {
            var existingRole = await _roleManager.FindByIdAsync(request.Id);
            if (existingRole == null)
            {
                throw new BusinessException("Role does not exist.");
            }
            existingRole.Name = request.Name;

            var result = await _roleManager.UpdateAsync(existingRole);
            if (!result.Succeeded)
            {
                throw new BusinessException("Role update failed.");
            }

            return existingRole;
        }
    }
}
