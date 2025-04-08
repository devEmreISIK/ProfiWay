using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Logging;
using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Validation;
using Core.CrossCuttingConcerns.Logger.Serilog;
using Microsoft.Extensions.DependencyInjection;
using ProfiWay.Application.Services.JwtServices;
using ProfiWay.Application.Services.RedisServices;
using FluentValidation;
using System.Reflection;
using Core.Application.Pipelines.Caching;

namespace ProfiWay.Application;

public static class Extensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IRedisService, RedisCacheService>();

        services.AddTransient<LoggerServiceBase, MsSqlLogger>();

        services.AddValidatorsFromAssemblies([Assembly.GetExecutingAssembly()]);

        services.AddScoped<IJwtService, JwtService>();

        services.AddAutoMapper(Assembly.GetExecutingAssembly());



        services.AddMediatR(opt =>
        {
            opt.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            opt.AddOpenBehavior(typeof(PerformancePipeline<,>));
            opt.AddOpenBehavior(typeof(AuthorizationPipeline<,>));
            opt.AddOpenBehavior(typeof(ValidationPipeline<,>));
            opt.AddOpenBehavior(typeof(LoggingPipeline<,>));
            opt.AddOpenBehavior(typeof(CacheRemovePipeline<,>));
            opt.AddOpenBehavior(typeof(AddCachePipeline<,>));


        });

        return services;
    }
}
