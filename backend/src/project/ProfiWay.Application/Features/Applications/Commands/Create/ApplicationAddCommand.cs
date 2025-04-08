
using AutoMapper;
using Core.Application.Pipelines.Authorization;
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Applications.Constants;
using ProfiWay.Application.Services.Repositories;
using MyApplication = ProfiWay.Domain.Entities.Application;

namespace ProfiWay.Application.Features.Applications.Commands.Create;

public class ApplicationAddCommand : IRequest<MyApplication>, ICacheRemoverRequest, IRoleExists, ITransactionalRequest
{
    public string UserId { get; set; }
    public int JobPostingId { get; set; }
    public string[] Roles => ["JobSeeker"];

    public string? CacheKey => null;

    public bool ByPassCache => false;

    public string? CacheGroupKey => ApplicationConstants.ApplicationsCacheGroup;

    public class ApplicationAddCommandHandler : IRequestHandler<ApplicationAddCommand, MyApplication>
    {
        private readonly IMapper _mapper;
        private readonly IApplicationRepository _applicationRepository;

        public ApplicationAddCommandHandler(IMapper mapper, IApplicationRepository applicationRepository)
        {
            _mapper = mapper;
            _applicationRepository = applicationRepository;
        }

        public async Task<MyApplication> Handle(ApplicationAddCommand request, CancellationToken cancellationToken)
        {
            MyApplication application = _mapper.Map<MyApplication>(request);

            var isApplicationExists = await _applicationRepository.AnyAsync(x => x.UserId == application.UserId && x.JobPostingId == application.JobPostingId);

            if (isApplicationExists)
            {
                throw new BusinessException("You already applied this job.");
            }

            await _applicationRepository.AddAsync(application);

            return application;
        }
    }
}
