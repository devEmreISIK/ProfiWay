

using AutoMapper;
using Core.Application.Pipelines.Performance;
using LinqKit;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetList;

public class GetListJobPostingsQuery : IRequest<List<GetListJobPostingsResponseDto>>, IPerformanceRequest
{
    public int Index { get; set; }
    public int Size { get; set; }
    public string? Search { get; set; }
    public int? Location { get; set; }
    public int? Skill { get; set; }

    public class GetListJobPostingsQueryHandler : IRequestHandler<GetListJobPostingsQuery, List<GetListJobPostingsResponseDto>>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper, IRedisService redisService)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<List<GetListJobPostingsResponseDto>> Handle(GetListJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = $"jobpostings({request.Index}, {request.Size}, {request.Search}, {request.Location}, {request.Skill})";

            // Try to fetch the data from cache
            var cachedData = await _redisService.GetDataAsync<List<GetListJobPostingsResponseDto>>(cacheKey);
            if (cachedData != null)
            {
                return cachedData;
            }


            var predicate = PredicateBuilder.New<JobPosting>(x => true);

            if (!string.IsNullOrEmpty(request.Search))
            {
                predicate = predicate.And(x => x.Title.Contains(request.Search) || x.Description.Contains(request.Search));
            }

            if (request.Location.HasValue)
            {
                predicate = predicate.And(x => x.CityId == request.Location.Value);
            }

            if (request.Skill.HasValue)
            {
                predicate = predicate.And(x => x.JobPostingCompetences.Any(c => c.CompetenceId == request.Skill.Value));
            }

            List<JobPosting> jobPostings = await _jobPostingRepository.GetAllAsync(
                    filter: predicate,
                    enableTracking: false,
                    cancellationToken: cancellationToken
                );

            var pagedJobPostings = jobPostings
                .Skip(request.Index * request.Size)
                .Take(request.Size)
                .ToList();


            var responses = _mapper.Map<List<GetListJobPostingsResponseDto>>(pagedJobPostings);

            await _redisService.AddDataAsync(cacheKey, responses);

            return responses;
        }
    }
}

