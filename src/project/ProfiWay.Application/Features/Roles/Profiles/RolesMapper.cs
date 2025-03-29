
using AutoMapper;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Application.Features.Roles.Commands.Create;
using ProfiWay.Application.Features.Roles.Commands.Update;
using ProfiWay.Application.Features.Roles.Queries.GetList;

namespace ProfiWay.Application.Features.Roles.Profiles;

public class RolesMapper : Profile
{
    public RolesMapper()
    {
        CreateMap<RoleAddCommand, IdentityRole>();
        CreateMap<RoleUpdateCommand, IdentityRole>();
        CreateMap<IdentityRole, GetListRoleResponseDto>();
    }
}
