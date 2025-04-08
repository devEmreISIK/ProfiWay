

using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Resumes.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Commands.Create;

public class ResumeAddCommand : IRequest<Resume>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Experience { get; set; }
    public string Education { get; set; }
    public string? CvFilePath { get; set; }
    public string UserId { get; set; }
    public List<int> CompetenceIds { get; set; }

    public string[] Roles => ["JobSeeker"];

    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => ResumeConstants.ResumesCacheGroup;

    public class ResumeAddCommandHandler : IRequestHandler<ResumeAddCommand, Resume>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;

        public ResumeAddCommandHandler(IResumeRepository resumeRepository, IMapper mapper, ICompetenceRepository competenceRepository)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
        }

        public async Task<Resume> Handle(ResumeAddCommand request, CancellationToken cancellationToken)
        {
            Resume resume = _mapper.Map<Resume>(request);

            await _resumeRepository.AddAsync(resume, cancellationToken);

            var competences = await _competenceRepository.GetAllAsync(x => request.CompetenceIds.Contains(x.Id));

            if (competences.Count != request.CompetenceIds.Count)
            {
                throw new BusinessException("One or more competences not found!");
            }

            resume.ResumeCompetences = competences.Select(competence => new ResumeCompetence
            {
                CompetenceId = competence.Id,
                ResumeId = resume.Id
            }).ToList();

            await _resumeRepository.UpdateAsync(resume, cancellationToken);

            return resume;
        }
    }
}
