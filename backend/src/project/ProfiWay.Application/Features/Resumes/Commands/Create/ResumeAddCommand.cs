

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Commands.Create;

public class ResumeAddCommand : IRequest<Resume>
{
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Experience { get; set; }
    public string Education { get; set; }
    public string? CvFilePath { get; set; }
    public string UserId { get; set; }
    public List<int> CompetenceIds { get; set; }

    public string[] Roles => ["JobSeeker"];

    public class ResumeAddCommandHandler : IRequestHandler<ResumeAddCommand, Resume>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly IMapper _mapper;
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IRedisService _redisService;

        public ResumeAddCommandHandler(IResumeRepository resumeRepository, IMapper mapper, ICompetenceRepository competenceRepository, IRedisService redisService)
        {
            _resumeRepository = resumeRepository;
            _mapper = mapper;
            _competenceRepository = competenceRepository;
            _redisService = redisService;
        }

        public async Task<Resume> Handle(ResumeAddCommand request, CancellationToken cancellationToken)
        {
            Resume resume = _mapper.Map<Resume>(request);

            await _resumeRepository.AddAsync(resume, cancellationToken);

            var competences = await _competenceRepository.GetAllAsync(x => request.CompetenceIds.Contains(x.Id));

            if (competences.Count != request.CompetenceIds.Count)
            {
                throw new BusinessException("One or more competences not found!");
            }

            resume.ResumeCompetences = competences.Select(competence => new ResumeCompetence
            {
                CompetenceId = competence.Id,
                ResumeId = resume.Id
            }).ToList();

            await _resumeRepository.UpdateAsync(resume, cancellationToken);
            await _redisService.RemoveDataAsync("resumes");

            return resume;
        }
    }
}
