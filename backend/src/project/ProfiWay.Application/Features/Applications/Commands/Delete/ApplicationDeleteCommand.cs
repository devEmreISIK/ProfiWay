
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Commands.Delete;

public class ApplicationDeleteCommand : IRequest<string>, ICacheRemoverRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;
    public class ApplicationDeleteCommandHandler : IRequestHandler<ApplicationDeleteCommand, string>
    {
        private readonly IApplicationRepository _applicationRepository;

        public ApplicationDeleteCommandHandler(IApplicationRepository applicationRepository)
        {
            _applicationRepository = applicationRepository;
        }

        public async Task<string> Handle(ApplicationDeleteCommand request, CancellationToken cancellationToken)
        {
            var application = await _applicationRepository.GetAsync(x => x.Id == request.Id);

            if (application is null)
            {
                throw new NotFoundException("Application is not found.");
            }

            await _applicationRepository.DeleteAsync(application, cancellationToken);

            return "Success!";
        }
    }
}
