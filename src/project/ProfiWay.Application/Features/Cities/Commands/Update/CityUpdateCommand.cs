
using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Commands.Update;

public class CityUpdateCommand : IRequest<string>
{
    public int Id { get; set; }
    public string Name { get; set; }

    public class CityUpdateCommandHandler : IRequestHandler<CityUpdateCommand, string>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public CityUpdateCommandHandler(ICityRepository cityRepository, IMapper mapper, IRedisService redisService)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<string> Handle(CityUpdateCommand request, CancellationToken cancellationToken)
        {
            City _city = _mapper.Map<City>(request);

            City? city = await _cityRepository.GetAsync(x=>x.Id == _city.Id, cancellationToken: cancellationToken);

            if (city is null)
            {
                throw new NotFoundException("City not found.");
            }

            city.Name = _city.Name ?? city.Name;

            await _cityRepository.UpdateAsync(city, cancellationToken);

            await _redisService.RemoveDataAsync("cities");

            return "City updated.";
        }
    }
}
