
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Competences.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Commands.Create;

public class CompetenceAddCommand : IRequest<List<Competence>>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public List<string> Names { get; set; }
    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CompetenceConstants.CompetencesCacheGroup;
    public class CompetenceAddCommandHandler : IRequestHandler<CompetenceAddCommand, List<Competence>>
    {
        private readonly ICompetenceRepository _competenceRepository;
        public CompetenceAddCommandHandler(ICompetenceRepository competenceRepository)
        {
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

            return newCompetences;
        }
    }
}
