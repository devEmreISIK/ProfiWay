

using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Queries.GetList;

public class GetListCompetenceQuery : IRequest<List<GetListCompetenceResponseDto>>
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListCompetenceQueryHandler : IRequestHandler<GetListCompetenceQuery, List<GetListCompetenceResponseDto>>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListCompetenceQueryHandler(ICompetenceRepository competenceRepository, IMapper mapper, IRedisService redisService)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<List<GetListCompetenceResponseDto>> Handle(GetListCompetenceQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListCompetenceResponseDto>>("competences");
            if (cachedData is not null)
            {
                return cachedData;
            }

            List<Competence> competences = await _competenceRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCompetenceResponseDto>>(competences);

            await _redisService.AddDataAsync($"competences({request.Index}, {request.Size})", responses);

            return responses;
        }
    }
}
