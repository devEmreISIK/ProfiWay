
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Resumes.Commands.Delete;

public class ResumeDeleteCommand : IRequest<string>
{
    public int Id { get; set; }

    public class ResumeDeleteCommandHandler : IRequestHandler<ResumeDeleteCommand, string>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IRedisService _redisService;

        public ResumeDeleteCommandHandler(IResumeRepository resumeRepository, IRedisService redisService)
        {
            _resumeRepository = resumeRepository;
            _redisService = redisService;
        }
        public async Task<string> Handle(ResumeDeleteCommand request, CancellationToken cancellationToken)
        {
            var resume = await _resumeRepository.GetAsync(x=>x.Id == request.Id);

            if (resume is null)
            {
                throw new NotFoundException("Resume is not found.");
            }

            await _resumeRepository.DeleteAsync(resume, cancellationToken);
            await _redisService.RemoveDataAsync("resumes");

            return "Success!";

        }
    }
}
