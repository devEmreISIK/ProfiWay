

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;

namespace ProfiWay.Application.Features.Roles.Commands.Update;

public class RoleUpdateCommand : IRequest<string>
{
    public string Id { get; set; }
    public string Name { get; set; }

    public string[] Roles => ["Admin"];

    public class RoleUpdateCommandHandler : IRequestHandler<RoleUpdateCommand, string>
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;

        public RoleUpdateCommandHandler(RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<string> Handle(RoleUpdateCommand request, CancellationToken cancellationToken)
        {
            IdentityRole _role = _mapper.Map<IdentityRole>(request);
            var existingRole = await _roleManager.FindByIdAsync(_role.Id);
            if (existingRole == null)
            {
                throw new BusinessException("Role does not exist.");
            }
            existingRole.Name = _role.Name;

            var result = await _roleManager.UpdateAsync(existingRole);
            if (!result.Succeeded)
            {
                throw new BusinessException("Role update failed.");
            }

            return "Success!";
        }
    }
}
