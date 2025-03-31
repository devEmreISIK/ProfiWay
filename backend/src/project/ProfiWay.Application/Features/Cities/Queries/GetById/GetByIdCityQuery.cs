

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetById;

public class GetByIdCityQuery : IRequest<GetByIdCityResponseDto>
{
    public int Id { get; set; }

    public class GetByIdCityQueryHandler : IRequestHandler<GetByIdCityQuery, GetByIdCityResponseDto>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetByIdCityQueryHandler(ICityRepository cityRepository, IMapper mapper, IRedisService redisService)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<GetByIdCityResponseDto> Handle(GetByIdCityQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdCityResponseDto>($"city_{request.Id}");
            if (cachedData != null)
            {
                return cachedData;
            }

            City? city = await _cityRepository.GetAsync(x=>x.Id == request.Id, enableTracking: false, cancellationToken: cancellationToken);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            var response = _mapper.Map<GetByIdCityResponseDto>(city);

            await _redisService.AddDataAsync($"city_{city.Id}", response);

            return response;
        }
    }
}
