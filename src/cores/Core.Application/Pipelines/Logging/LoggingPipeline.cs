

using Core.CrossCuttingConcerns.Logger.Models;
using Core.CrossCuttingConcerns.Logger.Serilog;
using MediatR;
using Microsoft.AspNetCore.Http;
using System.Text.Json;

namespace Core.Application.Pipelines.Logging;

public class LoggingPipeline<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ILoggableRequest
{
    private readonly IHttpContextAccessor _httpContextAccessor;
    private readonly LoggerServiceBase _logger;

    public LoggingPipeline(IHttpContextAccessor httpContextAccessor, LoggerServiceBase logger)
    {
        _httpContextAccessor = httpContextAccessor;
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        List<LogParamater> paramaters = new List<LogParamater>()
        {
            new LogParamater(){Type = request.GetType().Name, Value = request },
        };

        var userInfo = _httpContextAccessor.HttpContext.User?.Claims?.FirstOrDefault(x => x.Type == "Email").Value ?? "?";

        LogDetail logDetail = new LogDetail()
        {
            MethodName = next.Method.Name,
            Parameters = paramaters,
            User = userInfo
        };

        string message = JsonSerializer.Serialize(logDetail);
        _logger.Info(message);

        return await next();
    }
}
