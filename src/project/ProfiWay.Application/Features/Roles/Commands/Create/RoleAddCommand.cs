

using AutoMapper;
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
        private readonly IMapper _mapper;

        public RoleAddCommandHandler(RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<string> Handle(RoleAddCommand request, CancellationToken cancellationToken)
        {
            IdentityRole _role = _mapper.Map<IdentityRole>(request);
            bool roleIsPresent = await _roleManager.RoleExistsAsync(_role.Name);

            if (roleIsPresent)
            {
                throw new BusinessException("Role should be unique");
            }

            IdentityRole role = new IdentityRole()
            {
                Name = _role.Name,
            };

            await _roleManager.CreateAsync(role);

            return "Success!";
        }
    }
}
