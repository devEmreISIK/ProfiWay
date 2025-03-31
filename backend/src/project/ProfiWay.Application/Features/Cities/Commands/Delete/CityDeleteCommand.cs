

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Cities.Commands.Delete;

public class CityDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public class CityDeleteCommandHandler : IRequestHandler<CityDeleteCommand, string>
    {
        private readonly ICityRepository _cityRepository;
        private readonly IRedisService _redisService;

        public CityDeleteCommandHandler(ICityRepository cityRepository, IRedisService redisService)
        {
            _cityRepository = cityRepository;
            _redisService = redisService;
        }

        public async Task<string> Handle(CityDeleteCommand request, CancellationToken cancellationToken)
        {
            var city = await _cityRepository.GetAsync(x=>x.Id == request.Id);

            if (city is null)
            {
                throw new NotFoundException("City is not found.");
            }

            await _cityRepository.DeleteAsync(city, cancellationToken);

            await _redisService.RemoveDataAsync("cities");

            return "City deleted";
        }
    }
}
