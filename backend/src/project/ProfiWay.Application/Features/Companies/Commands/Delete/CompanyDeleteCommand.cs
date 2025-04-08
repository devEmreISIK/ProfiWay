
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Companies.Commands.Delete;

public class CompanyDeleteCommand : IRequest<string>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public int Id { get; set; }

    public string[] Roles => ["Admin"];
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;
    public class CompanyDeleteCommandHandler : IRequestHandler<CompanyDeleteCommand, string>
    {
        private readonly ICompanyRepository _companyRepository;

        public CompanyDeleteCommandHandler(ICompanyRepository companyRepository)
        {
            _companyRepository = companyRepository;
        }

        public async Task<string> Handle(CompanyDeleteCommand request, CancellationToken cancellationToken)
        {
            var company = await _companyRepository.GetAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);

            if (company == null)
            {
                throw new NotFoundException("Company is not found.");
            }

            await _companyRepository.DeleteAsync(company, cancellationToken: cancellationToken);

            return "Company deleted.";
           
        }
    }
}
