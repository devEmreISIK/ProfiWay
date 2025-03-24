

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Queries.GetById;

public class GetByIdCompanyQuery : IRequest<GetByIdCompanyResponseDto>
{
    public int Id { get; set; }

    public class GetByIdCompanyQueryHandler : IRequestHandler<GetByIdCompanyQuery, GetByIdCompanyResponseDto>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public GetByIdCompanyQueryHandler(ICompanyRepository companyRepository, IMapper mapper, IRedisService redisService)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<GetByIdCompanyResponseDto> Handle(GetByIdCompanyQuery request, CancellationToken cancellationToken)
        {
            var cachedData = await _redisService.GetDataAsync<GetByIdCompanyResponseDto>($"company_{request.Id}");
            if (cachedData != null)
            {
                return cachedData;
            }

            Company? company = await _companyRepository.GetAsync(x=> x.Id == request.Id, enableTracking:false, cancellationToken: cancellationToken);

            if (company is null)
            {
                throw new NotFoundException("Company is not found.");
            }

            var response = _mapper.Map<GetByIdCompanyResponseDto>(company);

            await _redisService.AddDataAsync($"company_{company.Id}", company);

            return response;
        }
    }
}
