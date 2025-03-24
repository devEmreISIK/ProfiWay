

using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Queries.GetList;

public class GetListCompanyQuery : IRequest<List<GetListCompanyResponseDto>>
{
    public int Index { get; set; }
    public int Size { get; set; }

    public class GetListCompanyQueryHandler : IRequestHandler<GetListCompanyQuery, List<GetListCompanyResponseDto>>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetListCompanyQueryHandler(ICompanyRepository companyRepository, IMapper mapper, IRedisService redisService)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<List<GetListCompanyResponseDto>> Handle(GetListCompanyQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<List<GetListCompanyResponseDto>>("companies");
            if (cachedData != null) 
            {
                return cachedData;
            }

            List<Company> companies = await _companyRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCompanyResponseDto>>(companies);

            await _redisService.AddDataAsync($"companies({request.Index}, {request.Size})", responses);

            return responses;
        }
    }
}
