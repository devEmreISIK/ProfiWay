

using AutoMapper;
using Core.Application.Pipelines.Performance;
using Core.Persistance.DTOs;
using LinqKit;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.JobPostings.Queries.GetList;

public class GetListJobPostingsQuery : IRequest<PaginatedListDto<GetListJobPostingsResponseDto>>, IPerformanceRequest
{
    public int Index { get; set; }
    public int Size { get; set; }
    public string? Search { get; set; }
    public int? Location { get; set; }
    public int? Skill { get; set; }

    public class GetListJobPostingsQueryHandler : IRequestHandler<GetListJobPostingsQuery, PaginatedListDto<GetListJobPostingsResponseDto>>
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

        public async Task<PaginatedListDto<GetListJobPostingsResponseDto>> Handle(GetListJobPostingsQuery request, CancellationToken cancellationToken)
        {
            var cacheKey = $"paginated_jobpostings({request.Index}, {request.Size}, {request.Search}, {request.Location}, {request.Skill})";
            var cachedData = await _redisService.GetDataAsync<PaginatedListDto<GetListJobPostingsResponseDto>>(cacheKey);
            if (cachedData != null) return cachedData;


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

            // Tüm eşleşen ilanları al
            List<JobPosting> jobPostings = await _jobPostingRepository.GetAllAsync(
                    filter: predicate,
                    enableTracking: false,
                    cancellationToken: cancellationToken
                );

            // ---> TOPLAM SAYIYI AL <---
            int totalCount = jobPostings.Count;

            // O anki sayfa için ilanları al (Skip/Take)
            var pagedJobPostings = jobPostings
                .Skip(request.Index * request.Size)
                .Take(request.Size)
                .ToList();

            // Sayfadaki ilanları DTO'ya map'le
            var responses = _mapper.Map<List<GetListJobPostingsResponseDto>>(pagedJobPostings);

            // ---> YENİ WRAPPER DTO'yu OLUŞTUR <---
            var result = new PaginatedListDto<GetListJobPostingsResponseDto>
            {
                Items = responses,
                TotalCount = totalCount
                // İsteğe bağlı: Index = request.Index, Size = request.Size vb.
            };

            // Cache'e yeni yapıyı kaydet
            await _redisService.AddDataAsync(cacheKey, result);

            // Yeni yapıyı döndür
            return result;
        }
    }
}

