
using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Commands.Update;

public class CompetenceUpdateCommand : IRequest<Competence>
{
    public int Id { get; set; }
    public string Name { get; set; }

    public class CompetenceUpdateCommandHandler : IRequestHandler<CompetenceUpdateCommand, Competence>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public CompetenceUpdateCommandHandler(ICompetenceRepository competenceRepository, IMapper mapper, IRedisService redisService)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<Competence> Handle(CompetenceUpdateCommand request, CancellationToken cancellationToken)
        {
            Competence _competence = _mapper.Map<Competence>(request);

            Competence? competence = await _competenceRepository.GetAsync(x => x.Id == _competence.Id);

            if (competence is null)
            {
                throw new NotFoundException("Competence is not found.");
            }

            competence.Name = _competence.Name ?? competence.Name;

            await _competenceRepository.UpdateAsync(competence, cancellationToken);

            await _redisService.RemoveDataAsync("competences");

            return competence;
        }
    }
}
