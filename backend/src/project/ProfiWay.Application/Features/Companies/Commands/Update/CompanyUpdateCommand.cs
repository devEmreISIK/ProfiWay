

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
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

    public string[] Roles => ["Company"];
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

        public async Task<Company> Handle(CompanyUpdateCommand request, CancellationToken cancellationToken)
        {
            Company cmp = _mapper.Map<Company>(request);
            Company? company = await _companyRepository.GetAsync(x=> x.Id == cmp.Id, cancellationToken: cancellationToken);

            if (company is null)
            {
                throw new NotFoundException("Company not found.");
            }

            company.Name = cmp.Name ?? company.Name;
            company.Industry = cmp.Industry ?? company.Industry;
            company.Description = cmp.Description ?? company.Description;

            await _companyRepository.UpdateAsync(company, cancellationToken);

            await _redisService.RemoveDataAsync("companies");
            await _redisService.RemoveDataAsync($"company_{company.UserId}");

            return company;

        }
    }
}
