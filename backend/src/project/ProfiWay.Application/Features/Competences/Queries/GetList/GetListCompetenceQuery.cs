using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Competences.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Queries.GetList;

public class GetListCompetenceQuery : IRequest<List<GetListCompetenceResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public string? CacheKey => $"GetAllCompetences";

    public bool BypassCache => false;

    public string? CacheGroupKey => CompetenceConstants.CompetencesCacheGroup;

    public TimeSpan? SlidingExpiration => null;
    public class GetListCompetenceQueryHandler : IRequestHandler<GetListCompetenceQuery, List<GetListCompetenceResponseDto>>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;

        public GetListCompetenceQueryHandler(ICompetenceRepository competenceRepository, IMapper mapper)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
        }
        public async Task<List<GetListCompetenceResponseDto>> Handle(GetListCompetenceQuery request, CancellationToken cancellationToken)
        {
            List<Competence> competences = await _competenceRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCompetenceResponseDto>>(competences);

            return responses;
        }
    }
}
