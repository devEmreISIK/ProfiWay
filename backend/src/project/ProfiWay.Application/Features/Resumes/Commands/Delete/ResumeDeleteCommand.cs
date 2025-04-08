
using Core.Application.Pipelines.Caching;
using Core.Application.Pipelines.Transactional;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Features.Resumes.Constants;
using ProfiWay.Application.Services.Repositories;

namespace ProfiWay.Application.Features.Resumes.Commands.Delete;

public class ResumeDeleteCommand : IRequest<string>, ICacheRemoverRequest, ITransactionalRequest
{
    public int Id { get; set; }

    public string? CacheKey => null;
    public bool ByPassCache => false;
    public string? CacheGroupKey => ResumeConstants.ResumesCacheGroup;

    public class ResumeDeleteCommandHandler : IRequestHandler<ResumeDeleteCommand, string>
    {
        private readonly IResumeRepository _resumeRepository;

        public ResumeDeleteCommandHandler(IResumeRepository resumeRepository)
        {
            _resumeRepository = resumeRepository;
        }
        public async Task<string> Handle(ResumeDeleteCommand request, CancellationToken cancellationToken)
        {
            var resume = await _resumeRepository.GetAsync(x=>x.Id == request.Id);

            if (resume is null)
            {
                throw new NotFoundException("Resume is not found.");
            }

            await _resumeRepository.DeleteAsync(resume, cancellationToken);

            return "Success!";

        }
    }
}
