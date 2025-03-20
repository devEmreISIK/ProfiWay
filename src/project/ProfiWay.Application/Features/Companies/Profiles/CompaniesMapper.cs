
using AutoMapper;
using ProfiWay.Application.Features.Companies.Commands.Create;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Profiles;

public class CompaniesMapper : Profile
{
    public CompaniesMapper()
    {
        CreateMap<CompanyAddCommand, Company>();
    }
}
