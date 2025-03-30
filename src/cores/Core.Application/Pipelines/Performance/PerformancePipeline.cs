

using MediatR;
using Microsoft.Extensions.Logging;
using System.Diagnostics;

namespace Core.Application.Pipelines.Performance;

public class PerformancePipeline<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, IPerformanceRequest
{
    private readonly ILogger<PerformancePipeline<TRequest, TResponse>> _logger;

    public PerformancePipeline(ILogger<PerformancePipeline<TRequest, TResponse>> logger)
    {
        _logger = logger;
    }

    public async Task<TResponse> Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        var stopwatch = Stopwatch.StartNew();

        TResponse response = await next();

        stopwatch.Stop();

        if (stopwatch.ElapsedMilliseconds > 500)
        {
            // Logger
        }

        return response;
    }
}
