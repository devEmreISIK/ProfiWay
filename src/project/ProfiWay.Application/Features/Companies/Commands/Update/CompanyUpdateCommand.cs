

using AutoMapper;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Commands.Update;

public class CompanyUpdateCommand : IRequest<Company>
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }

    public class CompanyUpdateCommandHandler : IRequestHandler<CompanyUpdateCommand, Company>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public CompanyUpdateCommandHandler(ICompanyRepository companyRepository, IMapper mapper, IRedisService redisService)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public Task<Company> Handle(CompanyUpdateCommand request, CancellationToken cancellationToken)
        {
            throw new NotImplementedException(); // Buradan devam edilecek.
        }
    }
}
