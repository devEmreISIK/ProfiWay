using AutoMapper;
using Core.Application.Pipelines.Performance;
using MediatR;
using ProfiWay.Application.Features.Cities.Queries.GetList;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetListDetail;

public class GetListDetailCityQuery : IRequest<List<GetListDetailCityResponseDto>>, IPerformanceRequest
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListDetailCityQueryHandler : IRequestHandler<GetListDetailCityQuery, List<GetListDetailCityResponseDto>>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IRedisService _redisService;
        private readonly IMapper _mapper;

        public GetListDetailCityQueryHandler(ICityRepository cityRepository, IRedisService redisService, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _redisService = redisService;
            _mapper = mapper;
        }
        public async Task<List<GetListDetailCityResponseDto>> Handle(GetListDetailCityQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListDetailCityResponseDto>>("cities_detail");
            if (cachedData is not null)
            {
                return cachedData;
            }

            List<City> cities = await _cityRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListDetailCityResponseDto>>(cities);

            await _redisService.AddDataAsync($"cities_detail({request.Index}, {request.Size})", responses);

            return responses;
        }
    }
}
