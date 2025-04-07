
using AutoMapper;
using Core.Application.Pipelines.Performance;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetById;

public class GetByIdJobPostingsQuery : IRequest<GetByIdJobPostingsResponseDto>, IPerformanceRequest
{
    public int Id { get; set; }

    public class GetByIdJobPostingsQueryHandler : IRequestHandler<GetByIdJobPostingsQuery, GetByIdJobPostingsResponseDto>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IRedisService _redisService;

        public GetByIdJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, ICompetenceRepository competenceRepository, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
            _redisService = redisService;
        }
        public async Task<GetByIdJobPostingsResponseDto> Handle(GetByIdJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdJobPostingsResponseDto>($"jobpostings_{request.Id}");
            if (cachedData != null)
            {
                return cachedData;
            }

            JobPosting? jobPosting = await _jobPostingRepository.GetAsync(
                x => x.Id == request.Id,
                enableTracking: false,
                cancellationToken: cancellationToken
                );

            if (jobPosting is null)
            {
                throw new NotFoundException("Job post is not found.");
            }

            var response = _mapper.Map<GetByIdJobPostingsResponseDto>(jobPosting);

            await _redisService.AddDataAsync($"jobpostings_{jobPosting.Id}", response);

            return response;
        }
    }
}
