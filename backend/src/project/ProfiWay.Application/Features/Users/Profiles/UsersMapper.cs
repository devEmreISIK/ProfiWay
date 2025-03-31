

using AutoMapper;
using ProfiWay.Application.Features.Users.Queries.GetById;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Users.Profiles;

public class UsersMapper : Profile
{
    public UsersMapper()
    {
        CreateMap<User, GetUserByIdResponseDto>();
    }
}
