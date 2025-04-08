using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetList;

public class GetListCityQuery : IRequest<List<GetListCityResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public string? CacheKey => $"GetAllCities";

    public bool BypassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetListCityQueryHandler : IRequestHandler<GetListCityQuery, List<GetListCityResponseDto>>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;

        public GetListCityQueryHandler(ICityRepository cityRepository, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListCityResponseDto>> Handle(GetListCityQuery request, CancellationToken cancellationToken)
        {
            List<City> cities = await _cityRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCityResponseDto>>(cities);
            
            return responses;
        }
    }
}
