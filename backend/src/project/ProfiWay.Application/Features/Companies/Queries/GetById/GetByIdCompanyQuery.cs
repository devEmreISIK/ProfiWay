using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Companies.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Queries.GetById;

public class GetByIdCompanyQuery : IRequest<GetByIdCompanyResponseDto>, ICachableRequest, ITransactionalRequest
{
    public string UserId { get; set; }
    public string? CacheKey => $"GetCompanyByUserId({UserId})";

    public bool BypassCache => false;

    public string? CacheGroupKey => CompanyConstants.CompaniesCacheGroup;

    public TimeSpan? SlidingExpiration => null;

    public class GetByIdCompanyQueryHandler : IRequestHandler<GetByIdCompanyQuery, GetByIdCompanyResponseDto>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IMapper _mapper;

        public GetByIdCompanyQueryHandler(ICompanyRepository companyRepository, IMapper mapper)
        {
            _companyRepository = companyRepository;
            _mapper = mapper;
        }

        public async Task<GetByIdCompanyResponseDto> Handle(GetByIdCompanyQuery request, CancellationToken cancellationToken)
        {
            Company? company = await _companyRepository.GetAsync(x=> x.UserId == request.UserId, enableTracking:false, cancellationToken: cancellationToken);

            if (company is null)
            {
                throw new NotFoundException("Company is not found.");
            }

            var response = _mapper.Map<GetByIdCompanyResponseDto>(company);

            return response;
        }
    }
}
