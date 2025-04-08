using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Queries.GetList;

public class GetListApplicationByJobPostingQuery : IRequest<List<GetListApplicationByJobPostingResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int JobPostingId { get; set; }
    public int Index { get; set; }
    public int Size { get; set; }
    public string? CacheKey => $"applications_byjpid({JobPostingId}_{Index}_{Size})";
    public bool BypassCache => false;
    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;
    public TimeSpan? SlidingExpiration => null;

    public class GetListApplicationByJobPostingQueryHandler : IRequestHandler<GetListApplicationByJobPostingQuery, List<GetListApplicationByJobPostingResponseDto>>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public GetListApplicationByJobPostingQueryHandler(IApplicationRepository applicationRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }
        public async Task<List<GetListApplicationByJobPostingResponseDto>> Handle(GetListApplicationByJobPostingQuery request, CancellationToken cancellationToken)
        {
            List<ProfiWay.Domain.Entities.Application> applications = await _applicationRepository.GetAllAsync(x => x.JobPostingId == request.JobPostingId);

            var responses = _mapper.Map<List<GetListApplicationByJobPostingResponseDto>>(applications);
            
            return responses;
        }
    }
}
