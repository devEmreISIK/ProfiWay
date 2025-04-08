

using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetById;

public class GetByIdCityQuery : IRequest<GetByIdCityResponseDto>, ICachableRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string? CacheKey => $"GetCityById({Id})";

    public bool BypassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public TimeSpan? SlidingExpiration => null;
    public class GetByIdCityQueryHandler : IRequestHandler<GetByIdCityQuery, GetByIdCityResponseDto>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;

        public GetByIdCityQueryHandler(ICityRepository cityRepository, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdCityResponseDto> Handle(GetByIdCityQuery request, CancellationToken cancellationToken)
        {
            City? city = await _cityRepository.GetAsync(x=>x.Id == request.Id, enableTracking: false, cancellationToken: cancellationToken);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            var response = _mapper.Map<GetByIdCityResponseDto>(city);

            return response;
        }
    }
}
