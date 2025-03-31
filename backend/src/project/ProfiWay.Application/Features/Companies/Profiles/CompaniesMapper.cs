
using AutoMapper;
using ProfiWay.Application.Features.Companies.Commands.Create;
using ProfiWay.Application.Features.Companies.Commands.Update;
using ProfiWay.Application.Features.Companies.Queries.GetById;
using ProfiWay.Application.Features.Companies.Queries.GetList;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Profiles;

public class CompaniesMapper : Profile
{
    public CompaniesMapper()
    {
        CreateMap<CompanyAddCommand, Company>();
        CreateMap<CompanyUpdateCommand, Company>();
        CreateMap<Company, GetByIdCompanyResponseDto>();
        CreateMap<Company, GetListCompanyResponseDto>();
    }
}
