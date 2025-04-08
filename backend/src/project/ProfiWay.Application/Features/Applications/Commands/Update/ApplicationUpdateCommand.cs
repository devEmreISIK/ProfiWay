using AutoMapper;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using MyApplication = ProfiWay.Domain.Entities.Application;

namespace ProfiWay.Application.Features.Applications.Commands.Update;

public class ApplicationUpdateCommand : IRequest<MyApplication>, ICacheRemoverRequest, ITransactionalRequest
{
    public int Id { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;


    public class ApplicationUpdateCommandHandler : IRequestHandler<ApplicationUpdateCommand, MyApplication>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;

        public ApplicationUpdateCommandHandler(IApplicationRepository applicationRepository, IMapper mapper)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
        }

        public async Task<MyApplication> Handle(ApplicationUpdateCommand request, CancellationToken cancellationToken)
        {
            MyApplication _application = _mapper.Map<MyApplication>(request);

            MyApplication? application = await _applicationRepository.GetAsync(x => x.Id == _application.Id);

            if (application is null)
            {
                throw new NotFoundException("There is no application.");
            }

            application.Status = _application.Status;

            await _applicationRepository.UpdateAsync(application, cancellationToken);

            return application;
        }
    }
}
