

using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Queries.GetListByUser;

public class GetListApplicationByUserIdQuery : IRequest<List<GetListApplicationByUserIdResponseDto>>
{
    public string UserId { get; set; }

    public class GetListApplicationByUserIdQueryHandler : IRequestHandler<GetListApplicationByUserIdQuery, List<GetListApplicationByUserIdResponseDto>>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListApplicationByUserIdQueryHandler(IApplicationRepository applicationRepository, IMapper mapper, IRedisService redisService)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<List<GetListApplicationByUserIdResponseDto>> Handle(GetListApplicationByUserIdQuery request, CancellationToken cancellationToken)
        {
            string cacheKey = $"applications({request.UserId})";

            var cachedData = await _redisService.GetDataAsync<List<GetListApplicationByUserIdResponseDto>>(cacheKey);

            if (cachedData is not null)
            {
                return cachedData;
            }

            List<ProfiWay.Domain.Entities.Application> applications = await _applicationRepository.GetAllAsync(x => x.UserId == request.UserId);

            var responses = _mapper.Map<List<GetListApplicationByUserIdResponseDto>>(applications);

            await _redisService.AddDataAsync(cacheKey, responses);

            return responses;
        }
    }
}
