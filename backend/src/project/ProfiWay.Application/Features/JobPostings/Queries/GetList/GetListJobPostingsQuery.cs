

using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using Core.Persistance.DTOs;
using LinqKit;
using MediatR;
using ProfiWay.Application.Features.JobPostings.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetList;

public class GetListJobPostingsQuery : IRequest<PaginatedListDto<GetListJobPostingsResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int Index { get; set; }
    public int Size { get; set; }
    public string? Search { get; set; }
    public int? Location { get; set; }
    public int? Skill { get; set; }
    public string? CacheKey => $"JobPostings:paginated_jobpostings({Index}, {Size}, {Search}, {Location}, {Skill})";
    public bool BypassCache => false;
    public string? CacheGroupKey => JobPostingConstants.JobPostingsCacheGroup;
    public TimeSpan? SlidingExpiration => null;

    public class GetListJobPostingsQueryHandler : IRequestHandler<GetListJobPostingsQuery, PaginatedListDto<GetListJobPostingsResponseDto>>
    {
        private readonly IJobPostingRepository _jobPostingRepository;
        private readonly IMapper _mapper;

        public GetListJobPostingsQueryHandler(IJobPostingRepository jobPostingRepository, IMapper mapper)
        {
            _jobPostingRepository = jobPostingRepository;
            _mapper = mapper;
        }

        public async Task<PaginatedListDto<GetListJobPostingsResponseDto>> Handle(GetListJobPostingsQuery request, CancellationToken cancellationToken)
        {

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

            int totalCount = jobPostings.Count;

            var pagedJobPostings = jobPostings
                .Skip(request.Index * request.Size)
                .Take(request.Size)
                .ToList();

            var responses = _mapper.Map<List<GetListJobPostingsResponseDto>>(pagedJobPostings);

            var result = new PaginatedListDto<GetListJobPostingsResponseDto>
            {
                Items = responses,
                TotalCount = totalCount
            };

            return result;
        }
    }
}

