﻿

using MediatR;
using System.Transactions;

namespace Core.Application.Pipelines.Transactional;

public class TransactionalPipeline<TRequest, TResponse> : IPipelineBehavior<TRequest, TResponse>
    where TRequest : IRequest<TResponse>, ITransactionalRequest
{
    async Task<TResponse> IPipelineBehavior<TRequest, TResponse>.Handle(TRequest request, RequestHandlerDelegate<TResponse> next, CancellationToken cancellationToken)
    {
        using (TransactionScope transaction = new(TransactionScopeAsyncFlowOption.Enabled))
        {
            TResponse response;
            try
            {
                response = await next();
                transaction.Complete();
            }catch (Exception)
            {
                transaction.Dispose();
            }

            return await next();
        }
    }
}
