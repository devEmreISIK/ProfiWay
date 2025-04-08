using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Features.Companies.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Commands.Update;

public class CompanyUpdateCommand : IRequest<Company>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }

    public string[] Roles => ["Company"];

    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CompanyConstants.CompaniesCacheGroup;
    public class CompanyUpdateCommandHandler : IRequestHandler<CompanyUpdateCommand, Company>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public CompanyUpdateCommandHandler(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
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

            return company;

        }
    }
}
