using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetByUserId;

public class GetByCompanyIdJobPostingsQuery : IRequest<List<GetByCompanyIdJobPostingsResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int CompanyId { get; set; }

    public string? CacheKey => $"JobPostings:GetJobPostingsByCompanyId({CompanyId})";

    public bool BypassCache => false;

    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetByUserIdJobPostingsQueryHandler : IRequestHandler<GetByCompanyIdJobPostingsQuery, List<GetByCompanyIdJobPostingsResponseDto>>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;

        public GetByUserIdJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
        }

        public async Task<List<GetByCompanyIdJobPostingsResponseDto>> Handle(GetByCompanyIdJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var jobPostings = await _jobPostingRepository.GetAllAsync(
                x => x.CompanyId == request.CompanyId, 
                enableTracking: false,
                cancellationToken: cancellationToken
            );

            if (jobPostings == null)
            {
                throw new NotFoundException("No job postings found for the given user.");
            }

            var responses = _mapper.Map<List<GetByCompanyIdJobPostingsResponseDto>>(jobPostings);

            return responses;
        }
    }
}
