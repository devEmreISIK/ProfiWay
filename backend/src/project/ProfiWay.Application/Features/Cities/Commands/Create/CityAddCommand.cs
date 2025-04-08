using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Commands.Create;

public class CityAddCommand : IRequest<List<City>>, IRoleExists, ICacheRemoverRequest, ITransactionalRequest
{
    public List<string> Names { get; set; }

    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public class CityAddCommandHandler : IRequestHandler<CityAddCommand, List<City>>
    {
        private readonly ICityRepository _cityRepository;

        public CityAddCommandHandler(ICityRepository cityRepository)
        {
            _cityRepository = cityRepository;
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

            return newCities;
        }
    }
}
