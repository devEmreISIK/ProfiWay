using Microsoft.Extensions.DependencyInjection;
using ProfiWay.Application.Services.JwtServices;
using System.Reflection;

namespace ProfiWay.Application;

public static class Extensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IJwtService, JwtService>();

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        return services;
    }
}
