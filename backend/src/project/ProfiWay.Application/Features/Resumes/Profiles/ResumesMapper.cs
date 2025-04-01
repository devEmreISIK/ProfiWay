

using AutoMapper;
using ProfiWay.Application.Features.Resumes.Commands.Create;
using ProfiWay.Application.Features.Resumes.Commands.Update;
using ProfiWay.Application.Features.Resumes.Queries;
using ProfiWay.Application.Features.Resumes.Queries.GetById;
using ProfiWay.Application.Features.Resumes.Queries.GetList;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Profiles;

public class ResumesMapper : Profile
{
    public ResumesMapper()
    {
        CreateMap<ResumeAddCommand, Resume>();
        CreateMap<ResumeUpdateCommand, Resume>();
        CreateMap<Resume, GetListResumeResponseDto>();
        CreateMap<Resume, GetByIdResumeResponseDto>();
        CreateMap<ResumeCompetence, ResumeCompetenceDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CompetenceId))
            .ForMember(dest => dest.CompetenceName, opt => opt.MapFrom(src => src.CompetenceName));
    }
}
