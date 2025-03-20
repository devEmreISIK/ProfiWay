using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using Microsoft.Extensions.DependencyInjection;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Persistance.Contexts;
using ProfiWay.Persistance.Repositories;

namespace ProfiWay.Persistance;

public static class Extensions
{
    public static IServiceCollection AddPersistanceServices(this IServiceCollection services, IConfiguration configuration)
    {
        services.AddDbContext<BaseDbContext>(opt =>
        {
            opt.UseSqlServer(configuration.GetConnectionString("SqlConnection"));
        });

        services.AddScoped<ICityRepository, CityRepository>();
        services.AddScoped<IApplicationRepository, ApplicationRepository>();
        services.AddScoped<ICompanyRepository, CompanyRepository>();
        services.AddScoped<ICompetenceRepository, CompetenceRepository>();
        services.AddScoped<IJobPostingRepository, JobPostingRepository>();
        services.AddScoped<IResumeRepository, ResumeRepository>();

        return services;
    }
}
