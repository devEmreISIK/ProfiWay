
using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Commands.Update;

public class JobPostingUpdateCommand : IRequest<JobPosting>
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int CityId { get; set; }
    public List<int> CompetenceIds { get; set; }
    public List<int> ApplicationIds { get; set; }

    public class JobPostingUpdateCommandHandler : IRequestHandler<JobPostingUpdateCommand, JobPosting>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IRedisService _redisService;

        public JobPostingUpdateCommandHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, ICompetenceRepository competenceRepository, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
            _redisService = redisService;
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
            await _redisService.RemoveDataAsync("jobpostings");

            return jobPosting;
        }
    }
}
