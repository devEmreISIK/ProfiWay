
using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Resumes.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Queries.GetList;

public class GetListResumeQuery : IRequest<List<GetListResumeResponseDto>>, ICachableRequest, ITransactionalRequest
{
    public int Index { get; set; }
    public int Size { get; set; }

    public string? CacheKey => $"GetAllResumes";

    public bool BypassCache => false;

    public string? CacheGroupKey => ResumeConstants.ResumesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetListResumeQueryHandler : IRequestHandler<GetListResumeQuery, List<GetListResumeResponseDto>>, IPerformanceRequest
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;

        public GetListResumeQueryHandler(IResumeRepository resumeRepository, IMapper mapper)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
        }
        public async Task<List<GetListResumeResponseDto>> Handle(GetListResumeQuery request, CancellationToken cancellationToken)
        {
            List<Resume> resumes = await _resumeRepository.GetAllAsync(
                            enableTracking: false,
                            cancellationToken: cancellationToken
                        );

            var responses = _mapper.Map<List<GetListResumeResponseDto>>(resumes);

            return responses;
        }
    }
}
