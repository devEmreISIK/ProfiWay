using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Competences.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Queries.GetById;

public class GetByIdCompetenceQuery : IRequest<GetByIdCompetenceResponseDto>, ICachableRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string? CacheKey => $"GetCompetenceById({Id})";

    public bool BypassCache => false;

    public string? CacheGroupKey => CompetenceConstants.CompetencesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetByIdCompetenceQueryHandler : IRequestHandler<GetByIdCompetenceQuery, GetByIdCompetenceResponseDto>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;

        public GetByIdCompetenceQueryHandler(ICompetenceRepository competenceRepository, IMapper mapper)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
        }
        public async Task<GetByIdCompetenceResponseDto> Handle(GetByIdCompetenceQuery request, CancellationToken cancellationToken)
        {
            Competence? competence = await _competenceRepository.GetAsync(x=>x.Id == request.Id);

            if (competence is null)
            {
                throw new NotFoundException("Competence is not found.");
            }

            var response = _mapper.Map<GetByIdCompetenceResponseDto>(competence);

            return response;
        }
    }
}
