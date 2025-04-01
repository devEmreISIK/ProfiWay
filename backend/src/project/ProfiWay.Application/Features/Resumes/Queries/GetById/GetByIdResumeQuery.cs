

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Queries.GetById;

public class GetByIdResumeQuery : IRequest<GetByIdResumeResponseDto>
{
    public string Id { get; set; }

    public class GetByIdResumeQueryHandler : IRequestHandler<GetByIdResumeQuery, GetByIdResumeResponseDto>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetByIdResumeQueryHandler(IResumeRepository resumeRepository, IMapper mapper, IRedisService redisService)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<GetByIdResumeResponseDto> Handle(GetByIdResumeQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdResumeResponseDto>($"resume_{request.Id}");
            if (cachedData != null)
            {
                return cachedData;
            }

            Resume? resume = await _resumeRepository.GetAsync(
                x => x.UserId == request.Id,
                enableTracking: false,
                cancellationToken: cancellationToken
            );

            if (resume is null)
            {
                throw new NotFoundException("Resume is not found.");
            }

            var response = _mapper.Map<GetByIdResumeResponseDto>(resume);

            await _redisService.AddDataAsync($"resume_{resume.Id}", resume);

            return response;
        }
    }
}
