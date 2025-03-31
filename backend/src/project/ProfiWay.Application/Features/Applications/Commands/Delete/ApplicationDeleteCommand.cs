
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Applications.Commands.Delete;

public class ApplicationDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public class ApplicationDeleteCommandHandler : IRequestHandler<ApplicationDeleteCommand, string>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IRedisService _redisService;

        public ApplicationDeleteCommandHandler(IApplicationRepository applicationRepository, IRedisService redisService)
        {
            _applicationRepository = applicationRepository;
            _redisService = redisService;
        }

        public async Task<string> Handle(ApplicationDeleteCommand request, CancellationToken cancellationToken)
        {
            var application = await _applicationRepository.GetAsync(x => x.Id == request.Id);

            if (application is null)
            {
                throw new NotFoundException("Application is not found.");
            }

            await _applicationRepository.DeleteAsync(application, cancellationToken);
            await _redisService.RemoveDataAsync("applications");

            return "Success!";
        }
    }
}
