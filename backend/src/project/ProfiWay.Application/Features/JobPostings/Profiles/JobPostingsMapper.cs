

using AutoMapper;
using ProfiWay.Application.Features.JobPostings.Commands.Create;
using ProfiWay.Application.Features.JobPostings.Commands.Update;
using ProfiWay.Application.Features.JobPostings.Queries;
using ProfiWay.Application.Features.JobPostings.Queries.GetById;
using ProfiWay.Application.Features.JobPostings.Queries.GetByUserId;
using ProfiWay.Application.Features.JobPostings.Queries.GetList;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Profiles;

public class JobPostingsMapper : Profile
{
    public JobPostingsMapper()
    {
        CreateMap<JobPostingAddCommand, JobPosting>();
        CreateMap<JobPostingUpdateCommand, JobPosting>();
        CreateMap<JobPosting, GetListJobPostingsResponseDto>();
        CreateMap<JobPosting, GetByIdJobPostingResponseDto>();
        CreateMap<JobPosting, GetByCompanyIdJobPostingsResponseDto>();
        CreateMap<JobPostingCompetence, JobPostingCompetenceDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.CompetenceId));
        CreateMap<ProfiWay.Domain.Entities.Application, ApplicationsDto>()
            .ForMember(dest => dest.Id, opt => opt.MapFrom(src => src.Id));
    }
}
