
using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Competences.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Competences.Commands.Update;

public class CompetenceUpdateCommand : IRequest<Competence>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public int Id { get; set; }
    public string Name { get; set; }

    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CompetenceConstants.CompetencesCacheGroup;
    public class CompetenceUpdateCommandHandler : IRequestHandler<CompetenceUpdateCommand, Competence>
    {
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;

        public CompetenceUpdateCommandHandler(ICompetenceRepository competenceRepository, IMapper mapper)
        {
            _competenceRepository = competenceRepository;
            _mapper = mapper;
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

            return competence;
        }
    }
}
