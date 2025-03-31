using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Logging;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Commands.Create;

public class CityAddCommand : IRequest<List<City>>, IRoleExists
{
    public List<string> Names { get; set; }

    public string[] Roles => ["Admin"];

    public class CityAddCommandHandler : IRequestHandler<CityAddCommand, List<City>>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IRedisService _redisService;

        public CityAddCommandHandler(ICityRepository cityRepository, IRedisService redisService)
        {
            _cityRepository = cityRepository;
            _redisService = redisService;
        }

        public async Task<List<City>> Handle(CityAddCommand request, CancellationToken cancellationToken)
        {
            var existingCities = await _cityRepository.GetAllAsync(cancellationToken: cancellationToken);
            var existingCityNames = existingCities.Select(x => x.Name).ToHashSet();

            var newCities = request.Names
                .Where(name => !existingCityNames.Contains(name))
                .Select(name => new City { Name = name }).ToList();

            if (!newCities.Any())
            {
                throw new BusinessException("All cities already exists!");
            }

            await _cityRepository.AddRangeAsync(newCities, cancellationToken);
            await _redisService.RemoveDataAsync("cities");

            return newCities;
        }
    }
}
