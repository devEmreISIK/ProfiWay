using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetList;

public class GetListCityQuery : IRequest<List<GetListCityResponseDto>>
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListCityQueryHandler : IRequestHandler<GetListCityQuery, List<GetListCityResponseDto>>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IRedisService _redisService;
        private readonly IMapper _mapper;

        public GetListCityQueryHandler(ICityRepository cityRepository, IRedisService redisService, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _redisService = redisService;
            _mapper = mapper;
        }

        public async Task<List<GetListCityResponseDto>> Handle(GetListCityQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListCityResponseDto>>("cities");
            if (cachedData is not null)
            {
                return cachedData;
            }

            List<City> cities = await _cityRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCityResponseDto>>(cities);

            await _redisService.AddDataAsync($"cities({request.Index}, {request.Size})", responses);
            
            return responses;
        }
    }
}
