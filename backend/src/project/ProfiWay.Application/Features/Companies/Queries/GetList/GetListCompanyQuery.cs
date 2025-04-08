using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Transactional;
using MediatR;
using ProfiWay.Application.Features.Companies.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Queries.GetList;

public class GetListCompanyQuery : IRequest<List<GetListCompanyResponseDto>>, IPerformanceRequest, ICachableRequest, ITransactionalRequest
{
    public int Index { get; set; }
    public int Size { get; set; }
    public string? CacheKey => $"GetAllCompanies";

    public bool BypassCache => false;

    public string? CacheGroupKey => CompanyConstants.CompaniesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetListCompanyQueryHandler : IRequestHandler<GetListCompanyQuery, List<GetListCompanyResponseDto>>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public GetListCompanyQueryHandler(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<List<GetListCompanyResponseDto>> Handle(GetListCompanyQuery request, CancellationToken cancellationToken)
        {

            List<Company> companies = await _companyRepository.GetAllAsync(enableTracking: false, cancellationToken: cancellationToken);

            var responses = _mapper.Map<List<GetListCompanyResponseDto>>(companies);

            return responses;
        }
    }
}
