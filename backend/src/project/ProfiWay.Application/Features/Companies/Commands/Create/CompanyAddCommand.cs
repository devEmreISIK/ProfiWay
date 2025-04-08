using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Companies.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Commands.Create;

public class CompanyAddCommand : IRequest<Company>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }
    public string UserId { get; set; }

    public string[] Roles => ["Company"];

    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => CompanyConstants.CompaniesCacheGroup;

    public class CompanyAddCommandHandler : IRequestHandler<CompanyAddCommand, Company>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public CompanyAddCommandHandler(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<Company> Handle(CompanyAddCommand request, CancellationToken cancellationToken)
        {
            Company company = _mapper.Map<Company>(request);
            await _companyRepository.AddAsync(company, cancellationToken);

            return company;
        }
    }
}
