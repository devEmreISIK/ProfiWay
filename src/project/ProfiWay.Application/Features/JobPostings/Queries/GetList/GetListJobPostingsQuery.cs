

using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetList;

public class GetListJobPostingsQuery : IRequest<List<GetListJobPostingsResponseDto>>
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListJobPostingsQueryHandler : IRequestHandler<GetListJobPostingsQuery, List<GetListJobPostingsResponseDto>>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IRedisService _redisService;

        public GetListJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, ICompetenceRepository competenceRepository, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
            _redisService = redisService;
        }
        public async Task<List<GetListJobPostingsResponseDto>> Handle(GetListJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListJobPostingsResponseDto>>("jobpostings");
            if (cachedData != null)
            {
                return cachedData;
            }

            List<JobPosting> jobPostings = await _jobPostingRepository.GetAllAsync(
                    enableTracking: false,
                    cancellationToken: cancellationToken
                );

            var responses = _mapper.Map<List<GetListJobPostingsResponseDto>>(jobPostings);

            await _redisService.AddDataAsync($"jobpostings({request.Index}, {request.Size})", responses);

            return responses;
        }
    }
}

