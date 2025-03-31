using AutoMapper;
using Core.Application.Pipelines.Performance;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Queries.GetList;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetListDetail;

public class GetByIdDetailCityQuery : IRequest<GetByIdDetailCityResponseDto>, IPerformanceRequest
{
    public int Id { get; set; }

    public class GetByIdDetailCityQueryHandler : IRequestHandler<GetByIdDetailCityQuery, GetByIdDetailCityResponseDto>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IRedisService _redisService;
        private readonly IMapper _mapper;

        public GetByIdDetailCityQueryHandler(ICityRepository cityRepository, IRedisService redisService, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _redisService = redisService;
            _mapper = mapper;
        }
        public async Task<GetByIdDetailCityResponseDto> Handle(GetByIdDetailCityQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdDetailCityResponseDto>($"city_detail{request.Id}");
            if (cachedData is not null)
            {
                return cachedData;
            }

            City? city = await _cityRepository.GetAsync(x=> x.Id == request.Id, enableTracking: false, cancellationToken: cancellationToken);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            var response = _mapper.Map<GetByIdDetailCityResponseDto>(city);

            await _redisService.AddDataAsync($"city_detail{city.Id}", response);

            return response;
        }
    }
}
