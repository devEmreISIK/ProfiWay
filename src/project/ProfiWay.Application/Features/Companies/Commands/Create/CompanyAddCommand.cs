
using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Commands.Create;

public class CompanyAddCommand : IRequest<Company>
{
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }
    public string UserId { get; set; }


    public class CompanyAddCommandHandler : IRequestHandler<CompanyAddCommand, Company>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public CompanyAddCommandHandler(ICompanyRepository companyRepository, IMapper mapper, IRedisService redisService)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<Company> Handle(CompanyAddCommand request, CancellationToken cancellationToken)
        {
            Company company = _mapper.Map<Company>(request);
            await _companyRepository.AddAsync(company, cancellationToken);
            await _redisService.RemoveDataAsync("companies");

            return company;
        }
    }
}
