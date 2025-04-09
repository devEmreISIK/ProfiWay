
using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetById;

public class GetByIdJobPostingQuery : IRequest<GetByIdJobPostingResponseDto>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int Id { get; set; }

    public string? CacheKey => $"JobPostings:GetJobPostingsById({Id})";

    public bool BypassCache => false;

    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetByIdJobPostingsQueryHandler : IRequestHandler<GetByIdJobPostingQuery, GetByIdJobPostingResponseDto>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;

        public GetByIdJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdJobPostingResponseDto> Handle(GetByIdJobPostingQuery request, CancellationToken cancellationToken)
        {
            JobPosting? jobPosting = await _jobPostingRepository.GetAsync(
                x => x.Id == request.Id,
                enableTracking: false,
                cancellationToken: cancellationToken
                );

            if (jobPosting is null)
            {
                throw new NotFoundException("Job post is not found.");
            }

            var response = _mapper.Map<GetByIdJobPostingResponseDto>(jobPosting);

            return response;
        }
    }
}
