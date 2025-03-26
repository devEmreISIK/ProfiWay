
using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Queries.GetList;

public class GetListResumeQuery : IRequest<List<GetListResumeResponseDto>>
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListResumeQueryHandler : IRequestHandler<GetListResumeQuery, List<GetListResumeResponseDto>>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListResumeQueryHandler(IResumeRepository resumeRepository, IMapper mapper, IRedisService redisService)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<List<GetListResumeResponseDto>> Handle(GetListResumeQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListResumeResponseDto>>("resumes");
            if (cachedData != null)
            {
                return cachedData;
            }

            List<Resume> resumes = await _resumeRepository.GetAllAsync(
                            enableTracking: false,
                            cancellationToken: cancellationToken
                        );

            var responses = _mapper.Map<List<GetListResumeResponseDto>>(resumes);

            await _redisService.AddDataAsync($"resumes({request.Index}, {request.Size})", responses);

            return responses;
        }
    }
}
