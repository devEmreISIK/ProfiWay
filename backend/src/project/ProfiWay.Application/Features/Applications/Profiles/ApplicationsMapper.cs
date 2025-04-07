
using AutoMapper;
using ProfiWay.Application.Features.Applications.Commands.Create;
using ProfiWay.Application.Features.Applications.Commands.Update;
using ProfiWay.Application.Features.Applications.Queries.GetList;
using ProfiWay.Application.Features.Applications.Queries.GetListByUser;

namespace ProfiWay.Application.Features.Applications.Profiles;

using MyApplication = ProfiWay.Domain.Entities.Application;

public class ApplicationsMapper : Profile
{
    public ApplicationsMapper()
    {
        CreateMap<ApplicationAddCommand, MyApplication>();
        CreateMap<ApplicationUpdateCommand, MyApplication>();
        CreateMap<MyApplication, GetListApplicationByJobPostingResponseDto>();
        CreateMap<MyApplication, GetListApplicationByUserIdResponseDto>();
    }
}
