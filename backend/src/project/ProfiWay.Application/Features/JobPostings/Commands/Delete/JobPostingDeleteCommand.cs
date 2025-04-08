using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.JobPostings.Commands.Delete;

public class JobPostingDeleteCommand : IRequest<string>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public int Id { get; set; }

    public string[] Roles => ["Company", "Admin"];

    public string? CacheKey => null;

    public bool ByPassCache => false;
    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;

    public class JobPostingDeleteCommandHandler : IRequestHandler<JobPostingDeleteCommand, string>
    {
        private readonly IJobPostingRepository _jobPostingRepository;

        public JobPostingDeleteCommandHandler(IJobPostingRepository jobPostingRepository)
        {
            _jobPostingRepository = jobPostingRepository;
        }

        public async Task<string> Handle(JobPostingDeleteCommand request, CancellationToken cancellationToken)
        {
            var jobPosting = await _jobPostingRepository.GetAsync(x=>x.Id == request.Id);

            if (jobPosting is null)
            {
                throw new NotFoundException("Job post is not found.");
            }

            await _jobPostingRepository.DeleteAsync(jobPosting, cancellationToken);

            return "Success!";
        }
    }
}
