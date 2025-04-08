
using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Commands.Update;

public class CityUpdateCommand : IRequest<string>, IRoleExists, ICacheRemoverRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public string[] Roles => ["Admin"];
    public class CityUpdateCommandHandler : IRequestHandler<CityUpdateCommand, string>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;

        public CityUpdateCommandHandler(ICityRepository cityRepository, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
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

            return "City updated.";
        }
    }
}
