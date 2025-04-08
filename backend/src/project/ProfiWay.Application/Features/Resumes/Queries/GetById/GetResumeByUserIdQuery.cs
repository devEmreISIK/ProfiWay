

using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Resumes.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Queries.GetById;

public class GetResumeByUserIdQuery : IRequest<GetResumeByUserIdResponseDto>, ICachableRequest, ITransactionalRequest
{
    public string Id { get; set; }

    public string? CacheKey => $"GetResumeByUserId({Id})";

    public bool BypassCache => false;

    public string? CacheGroupKey => ResumeConstants.ResumesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetByIdResumeQueryHandler : IRequestHandler<GetResumeByUserIdQuery, GetResumeByUserIdResponseDto>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;

        public GetByIdResumeQueryHandler(IResumeRepository resumeRepository, IMapper mapper)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
        }
        public async Task<GetResumeByUserIdResponseDto> Handle(GetResumeByUserIdQuery request, CancellationToken cancellationToken)
        {
            Resume? resume = await _resumeRepository.GetAsync(
                x => x.UserId == request.Id,
                enableTracking: false,
                cancellationToken: cancellationToken
            );

            if (resume is null)
            {
                throw new NotFoundException("Resume is not found.");
            }

            var response = _mapper.Map<GetResumeByUserIdResponseDto>(resume);

            return response;
        }
    }
}
