using AutoMapper;
using Core.Application.Pipelines.Performance;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Queries.GetList;

public class GetListApplicationByJobPostingQuery : IRequest<List<GetListApplicationByJobPostingResponseDto>>, IPerformanceRequest
{
    public int JobPostingId { get; set; }
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListApplicationByJobPostingQueryHandler : IRequestHandler<GetListApplicationByJobPostingQuery, List<GetListApplicationByJobPostingResponseDto>>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListApplicationByJobPostingQueryHandler(IApplicationRepository applicationRepository, IMapper mapper, IRedisService redisService)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
            _redisService = redisService;
        }
        public async Task<List<GetListApplicationByJobPostingResponseDto>> Handle(GetListApplicationByJobPostingQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListApplicationByJobPostingResponseDto>>("applicationsbyjob");

            if (cachedData is not null)
            {
                return cachedData;
            }

            List<ProfiWay.Domain.Entities.Application> applications = await _applicationRepository.GetAllAsync(x => x.JobPostingId == request.JobPostingId);

            var responses = _mapper.Map<List<GetListApplicationByJobPostingResponseDto>>(applications);

            await _redisService.AddDataAsync($"applications_job{request.JobPostingId}({request.Index}, {request.Size})", responses);
            
            return responses;
        }
    }
}
