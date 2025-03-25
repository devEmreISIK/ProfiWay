
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Commands.Create;

public class CompetenceAddCommand : IRequest<List<Competence>>
{
    public List<string> Names { get; set; }

    public class CompetenceAddCommandHandler : IRequestHandler<CompetenceAddCommand, List<Competence>>
    {
        private readonly IRedisService _redisService;
        private readonly ICompetenceRepository _competenceRepository;
        public CompetenceAddCommandHandler(IRedisService redisService, ICompetenceRepository competenceRepository)
        {
            _redisService = redisService;
            _competenceRepository = competenceRepository;
        }

        public async Task<List<Competence>> Handle(CompetenceAddCommand request, CancellationToken cancellationToken)
        {
            var existingCompetences = await _competenceRepository.GetAllAsync();
            var existingCompetenceNames = existingCompetences.Select(x => x.Name).ToHashSet();

            var newCompetences = request.Names
                .Where(name => !existingCompetenceNames.Contains(name))
                .Select(name =>  new Competence { Name = name })
                .ToList();

            if (!newCompetences.Any())
            {
                throw new BusinessException("All competences already exists!");
            }

            await _competenceRepository.AddRangeAsync(newCompetences, cancellationToken);
            await _redisService.RemoveDataAsync("competences");

            return newCompetences;
        }
    }
}
