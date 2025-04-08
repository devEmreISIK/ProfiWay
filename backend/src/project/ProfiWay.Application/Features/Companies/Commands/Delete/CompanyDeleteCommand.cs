

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Commands.Delete;

public class CompanyDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public string[] Roles => ["Admin"];
    public class CompanyDeleteCommandHandler : IRequestHandler<CompanyDeleteCommand, string>
    {
        private readonly ICompanyRepository _companyRepository;
        private readonly IRedisService _redisService;

        public CompanyDeleteCommandHandler(ICompanyRepository companyRepository, IRedisService redisService)
        {
            _companyRepository = companyRepository;
            _redisService = redisService;
        }

        public async Task<string> Handle(CompanyDeleteCommand request, CancellationToken cancellationToken)
        {
            var company = await _companyRepository.GetAsync(x => x.Id == request.Id, cancellationToken: cancellationToken);

            if (company == null)
            {
                throw new NotFoundException("Company is not found.");
            }

            await _companyRepository.DeleteAsync(company, cancellationToken: cancellationToken);

            await _redisService.RemoveDataAsync("companies");

            return "Company deleted.";
           
        }
    }
}
