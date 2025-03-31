
using AutoMapper;
using ProfiWay.Application.Features.Cities.Commands.Update;
using ProfiWay.Application.Features.Cities.Queries.GetById;
using ProfiWay.Application.Features.Cities.Queries.GetList;
using ProfiWay.Application.Features.Cities.Queries.GetListDetail;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Profiles;

public class CitiesMapper : Profile
{
    public CitiesMapper()
    {
        CreateMap<CityUpdateCommand, City>();
        CreateMap<City, GetListCityResponseDto>();
        CreateMap<City, GetByIdDetailCityResponseDto>()
            .ForMember(dest => dest.JobPostings, opt => opt.MapFrom(src => src.JobPostings));
        CreateMap<City, GetByIdCityResponseDto>();
    }
}
