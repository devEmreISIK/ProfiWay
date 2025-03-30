
using AutoMapper;
using Core.Application.Pipelines.Performance;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace ProfiWay.Application.Features.Roles.Queries.GetList;

public class GetListRoleQuery : IRequest<List<GetListRoleResponseDto>>
{
    public class GetListRoleQueryHandler : IRequestHandler<GetListRoleQuery, List<GetListRoleResponseDto>>, IPerformanceRequest
    {
        private readonly RoleManager<IdentityRole> _roleManager;
        private readonly IMapper _mapper;

        public GetListRoleQueryHandler(RoleManager<IdentityRole> roleManager, IMapper mapper)
        {
            _roleManager = roleManager;
            _mapper = mapper;
        }

        public async Task<List<GetListRoleResponseDto>> Handle(GetListRoleQuery request, CancellationToken cancellationToken)
        {
            var roles = await _roleManager.Roles.ToListAsync();

            var mappedRoles = _mapper.Map<List<GetListRoleResponseDto>>(roles);

            return mappedRoles;
        }
    }
}
