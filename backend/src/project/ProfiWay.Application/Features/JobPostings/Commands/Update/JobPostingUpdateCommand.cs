
using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Commands.Update;

public class JobPostingUpdateCommand : IRequest<JobPosting>, ICacheRemoverRequest, ITransactionalRequest, IRoleExists
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int CityId { get; set; }
    public List<int> CompetenceIds { get; set; }

    public string[] Roles => ["Company", "Admin"];

    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;

    public class JobPostingUpdateCommandHandler : IRequestHandler<JobPostingUpdateCommand, JobPosting>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;

        public JobPostingUpdateCommandHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, ICompetenceRepository competenceRepository)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
        }
        public async Task<JobPosting> Handle(JobPostingUpdateCommand request, CancellationToken cancellationToken)
        {
            JobPosting jp = _mapper.Map<JobPosting>(request);

            JobPosting? jobPosting = await _jobPostingRepository.GetAsync(x=>x.Id == jp.Id);

            if (jobPosting is null)
            {
                throw new NotFoundException("Resume not found!");
            }

            jobPosting.Title = jp.Title ?? jobPosting.Title;
            jobPosting.Description = jp.Description ?? jobPosting.Description;
            jobPosting.CityId = jp.CityId;
            jobPosting.UpdateTime = DateTime.UtcNow;

            var competences = await _competenceRepository.GetAllAsync(x => request.CompetenceIds.Contains(x.Id));

            if (competences.Count != request.CompetenceIds.Count)
            {
                throw new BusinessException("One or more competences not found!");
            }

            jobPosting.JobPostingCompetences.Clear();

            jobPosting.JobPostingCompetences = competences.Select(x => new JobPostingCompetence
            {
                JobPostingId = jobPosting.Id,
                CompetenceId = x.Id
            }).ToList();

            await _jobPostingRepository.UpdateAsync(jobPosting, cancellationToken);

            return jobPosting;
        }
    }
}
