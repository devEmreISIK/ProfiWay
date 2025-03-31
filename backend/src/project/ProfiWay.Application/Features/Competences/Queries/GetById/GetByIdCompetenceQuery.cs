

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Queries.GetById;

public class GetByIdCompetenceQuery : IRequest<GetByIdCompetenceResponseDto>
{
    public int Id { get; set; }

    public class GetByIdCompetenceQueryHandler : IRequestHandler<GetByIdCompetenceQuery, GetByIdCompetenceResponseDto>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetByIdCompetenceQueryHandler(ICompetenceRepository competenceRepository, IMapper mapper, IRedisService redisService)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<GetByIdCompetenceResponseDto> Handle(GetByIdCompetenceQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdCompetenceResponseDto>($"competence_{request.Id}");
            if (cachedData != null)
            {
                return cachedData;
            }

            Competence? competence = await _competenceRepository.GetAsync(x=>x.Id == request.Id);

            if (competence is null)
            {
                throw new NotFoundException("Competence is not found.");
            }

            var response = _mapper.Map<GetByIdCompetenceResponseDto>(competence);

            await _redisService.AddDataAsync($"competence_{competence.Id}", competence);

            return response;
        }
    }
}
