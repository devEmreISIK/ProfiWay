﻿using Core.Application.Pipelines.Performance;
using Core.Application.Pipelines.Validation;
using Microsoft.Extensions.DependencyInjection;
using ProfiWay.Application.Services.JwtServices;
using ProfiWay.Application.Services.RedisServices;
using System.Reflection;

namespace ProfiWay.Application;

public static class Extensions
{
    public static IServiceCollection AddApplicationServices(this IServiceCollection services)
    {
        services.AddScoped<IRedisService, RedisCacheService>();

        services.AddScoped<IJwtService, JwtService>();

        services.AddAutoMapper(Assembly.GetExecutingAssembly());

        services.AddMediatR(opt =>
        {
            opt.RegisterServicesFromAssembly(Assembly.GetExecutingAssembly());
            opt.AddOpenBehavior(typeof(PerformancePipeline<,>));
            opt.AddOpenBehavior(typeof(ValidationPipeline<,>));
        });

        return services;
    }
}
