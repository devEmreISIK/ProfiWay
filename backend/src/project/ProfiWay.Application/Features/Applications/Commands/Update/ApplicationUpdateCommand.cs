

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using MyApplication = ProfiWay.Domain.Entities.Application;

namespace ProfiWay.Application.Features.Applications.Commands.Update;

public class ApplicationUpdateCommand : IRequest<MyApplication>
{
    public int Id { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;


    public class ApplicationUpdateCommandHandler : IRequestHandler<ApplicationUpdateCommand, MyApplication>
    {
        private readonly IApplicationRepository _applicationRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public ApplicationUpdateCommandHandler(IApplicationRepository applicationRepository, IMapper mapper, IRedisService redisService)
        {
            _applicationRepository = applicationRepository;
            _mapper = mapper;
            _redisService = redisService;
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
            await _redisService.RemoveDataAsync("applications");

            return application;
        }
    }
}
