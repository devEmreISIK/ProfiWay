

using AutoMapper;
using ProfiWay.Application.Features.Competences.Commands.Update;
using ProfiWay.Application.Features.Competences.Queries.GetById;
using ProfiWay.Application.Features.Competences.Queries.GetList;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Profiles;

public class CompetencesMapper : Profile
{
    public CompetencesMapper()
    {
        CreateMap<CompetenceUpdateCommand, Competence>();
        CreateMap<Competence, GetListCompetenceResponseDto>();
        CreateMap<Competence, GetByIdCompetenceResponseDto>();
    }
}
