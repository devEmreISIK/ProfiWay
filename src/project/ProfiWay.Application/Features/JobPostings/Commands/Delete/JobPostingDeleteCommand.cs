

using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Commands.Delete;

public class JobPostingDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public class JobPostingDeleteCommandHandler : IRequestHandler<JobPostingDeleteCommand, string>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IRedisService _redisService;

        public JobPostingDeleteCommandHandler(IJobPostingRepository jobPostingRepository, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _redisService = redisService;
        }

        public async Task<string> Handle(JobPostingDeleteCommand request, CancellationToken cancellationToken)
        {
            var jobPosting = await _jobPostingRepository.GetAsync(x=>x.Id == request.Id);

            if (jobPosting is null)
            {
                throw new NotFoundException("Job post is not found.");
            }

            await _jobPostingRepository.DeleteAsync(jobPosting, cancellationToken);
            await _redisService.RemoveDataAsync("jobpostings");

            return "Success!";
        }
    }
}
