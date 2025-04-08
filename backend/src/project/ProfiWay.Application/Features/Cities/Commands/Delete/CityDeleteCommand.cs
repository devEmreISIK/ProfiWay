

using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Cities.Commands.Delete;

public class CityDeleteCommand : IRequest<string>, IRoleExists, ICacheRemoverRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public class CityDeleteCommandHandler : IRequestHandler<CityDeleteCommand, string>
    {
        private readonly ICityRepository _cityRepository;

        public CityDeleteCommandHandler(ICityRepository cityRepository)
        {
            _cityRepository = cityRepository;
        }

        public async Task<string> Handle(CityDeleteCommand request, CancellationToken cancellationToken)
        {
            var city = await _cityRepository.GetAsync(x=>x.Id == request.Id);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            await _cityRepository.DeleteAsync(city, cancellationToken);

            return "City deleted";
        }
    }
}
