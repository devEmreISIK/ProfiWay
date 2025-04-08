
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Competences.Constants;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Competences.Commands.Delete;

public class CompetenceDeleteCommand : IRequest<string>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public int Id { get; set; }

    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CompetenceConstants.CompetencesCacheGroup;
    public class CompetenceDeleteCommandHandler : IRequestHandler<CompetenceDeleteCommand, string>
    {
        private readonly ICompetenceRepository _competenceRepository;

        public CompetenceDeleteCommandHandler(ICompetenceRepository competenceRepository)
        {
            _competenceRepository = competenceRepository;
        }

        public async Task<string> Handle(CompetenceDeleteCommand request, CancellationToken cancellationToken)
        {
            var competence = await _competenceRepository.GetAsync(x => x.Id == request.Id);

            if (competence is null)
            {
                throw new NotFoundException("Competence is not found.");
            }

            await _competenceRepository.DeleteAsync(competence, cancellationToken);

            return "Competence deleted";
        }
    }
}
