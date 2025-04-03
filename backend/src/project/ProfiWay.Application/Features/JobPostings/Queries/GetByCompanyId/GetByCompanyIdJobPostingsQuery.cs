using AutoMapper;
using Core.Application.Pipelines.Performance;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Queries.GetList;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetByUserId;

public class GetByCompanyIdJobPostingsQuery : IRequest<List<GetByCompanyIdJobPostingsResponseDto>>, IPerformanceRequest
{
    public int CompanyId { get; set; }

    public class GetByUserIdJobPostingsQueryHandler : IRequestHandler<GetByCompanyIdJobPostingsQuery, List<GetByCompanyIdJobPostingsResponseDto>>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetByUserIdJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<List<GetByCompanyIdJobPostingsResponseDto>> Handle(GetByCompanyIdJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetByCompanyIdJobPostingsResponseDto>>($"jobpostings_{request.CompanyId}");
            if (cachedData != null)
            {
                return cachedData;
            }

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

            await _redisService.AddDataAsync($"jobpostings_{request.CompanyId}", responses);

            return responses;
        }
    }
}
