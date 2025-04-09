

using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Commands.Create;

public class JobPostingAddCommand : IRequest<JobPosting>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int CityId { get; set; }
    public List<int> CompetenceIds { get; set; }

    public string[] Roles => ["Company", "Admin"];

    public string? CacheKey => null;
    public bool ByPassCache => false;
    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;

    public class JobPostingAddCommandHandler : IRequestHandler<JobPostingAddCommand, JobPosting>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;

        public JobPostingAddCommandHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, ICompetenceRepository competenceRepository)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
        }

        public async Task<JobPosting> Handle(JobPostingAddCommand request, CancellationToken cancellationToken)
        {
            JobPosting jobPosting = _mapper.Map<JobPosting>(request);

            await _jobPostingRepository.AddAsync(jobPosting, cancellationToken);

            var competences = await _competenceRepository.GetAllAsync(x => request.CompetenceIds.Contains(x.Id));

            if (competences.Count != request.CompetenceIds.Count)
            {
                throw new BusinessException("One or more competences not found!");
            }

            jobPosting.JobPostingCompetences = competences.Select(competence => new JobPostingCompetence
            {
                CompetenceId = competence.Id,
                JobPostingId = jobPosting.Id
            }).ToList();

            await _jobPostingRepository.UpdateAsync(jobPosting, cancellationToken);

            return jobPosting;
        }
    }
}
