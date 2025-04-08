

using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Queries.GetListByUser;

public class GetListApplicationByUserIdQuery : IRequest<List<GetListApplicationByUserIdResponseDto>>, ICachableRequest, ITransactionalRequest
{
    public string UserId { get; set; }
    public string? CacheKey => $"applications_byuserid({UserId})";
    public bool BypassCache => false;
    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;
    public TimeSpan? SlidingExpiration => null;

    public class GetListApplicationByUserIdQueryHandler : IRequestHandler<GetListApplicationByUserIdQuery, List<GetListApplicationByUserIdResponseDto>>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public GetListApplicationByUserIdQueryHandler(IApplicationRepository applicationRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }
        public async Task<List<GetListApplicationByUserIdResponseDto>> Handle(GetListApplicationByUserIdQuery request, CancellationToken cancellationToken)
        {

            List<ProfiWay.Domain.Entities.Application> applications = await _applicationRepository.GetAllAsync(x => x.UserId == request.UserId);

            var responses = _mapper.Map<List<GetListApplicationByUserIdResponseDto>>(applications);

            return responses;
        }
    }
}
