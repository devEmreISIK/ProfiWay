
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Competences.Commands.Delete;

public class CompetenceDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public class CompetenceDeleteCommandHandler : IRequestHandler<CompetenceDeleteCommand, string>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IRedisService _redisService;

        public CompetenceDeleteCommandHandler(ICompetenceRepository competenceRepository, IRedisService redisService)
        {
            _competenceRepository = competenceRepository;
            _redisService = redisService;
        }

        public async Task<string> Handle(CompetenceDeleteCommand request, CancellationToken cancellationToken)
        {
            var competence = await _competenceRepository.GetAsync(x => x.Id == request.Id);

            if (competence is null)
            {
                throw new NotFoundException("Competence is not found.");
            }

            await _competenceRepository.DeleteAsync(competence, cancellationToken);

            await _redisService.RemoveDataAsync("competences");

            return "Competence deleted";
        }
    }
}
