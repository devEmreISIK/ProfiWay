using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Cities.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetListDetail;

public class GetByIdDetailCityQuery : IRequest<GetByIdDetailCityResponseDto>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string? CacheKey => $"GetCityDetailById({Id})";

    public bool BypassCache => false;

    public string? CacheGroupKey => CityConstants.CitiesCacheGroup;

    public TimeSpan? SlidingExpiration => null;
    public class GetByIdDetailCityQueryHandler : IRequestHandler<GetByIdDetailCityQuery, GetByIdDetailCityResponseDto>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IMapper _mapper;

        public GetByIdDetailCityQueryHandler(ICityRepository cityRepository, IMapper mapper)
        {
            _cityRepository = cityRepository;
            _mapper = mapper;
        }
        public async Task<GetByIdDetailCityResponseDto> Handle(GetByIdDetailCityQuery request, CancellationToken cancellationToken)
        {

            City? city = await _cityRepository.GetAsync(x=> x.Id == request.Id, enableTracking: false, cancellationToken: cancellationToken);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            var response = _mapper.Map<GetByIdDetailCityResponseDto>(city);

            return response;
        }
    }
}
