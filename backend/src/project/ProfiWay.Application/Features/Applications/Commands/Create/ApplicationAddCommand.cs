
using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using MyApplication = ProfiWay.Domain.Entities.Application;

namespace ProfiWay.Application.Features.Applications.Commands.Create;

public class ApplicationAddCommand : IRequest<MyApplication>
{
    public string UserId { get; set; }
    public int JobPostingId { get; set; }

    public class ApplicationAddCommandHandler : IRequestHandler<ApplicationAddCommand, MyApplication>
    {
        private readonly IMapper _mapper;
        private readonly IApplicationRepository _applicationRepository;
        private readonly IRedisService _redisService;

        public ApplicationAddCommandHandler(IMapper mapper, IApplicationRepository applicationRepository, IRedisService redisService)
        {
            _mapper = mapper;
            _applicationRepository = applicationRepository;
            _redisService = redisService;
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
            await _redisService.RemoveDataAsync("applications");

            return application;
        }
    }
}
