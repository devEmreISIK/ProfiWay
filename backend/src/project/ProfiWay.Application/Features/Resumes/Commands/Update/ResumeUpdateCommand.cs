

using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using ProfiWay.Application.Services.RedisServices;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Commands.Update;

public class ResumeUpdateCommand : IRequest<Resume>
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Experience { get; set; }
    public string Education { get; set; }
    public string? CvFilePath { get; set; }
    public List<int> CompetenceIds { get; set; } = new();
    public string[] Roles => ["JobSeeker"];

    public class ResumeUpdateCommandHandler : IRequestHandler<ResumeUpdateCommand, Resume>
    {
        private readonly IResumeRepository _resumeRepository;
        private readonly ICompetenceRepository _competenceRepository;
        private readonly IMapper _mapper;
        private readonly IRedisService _redisService;

        public ResumeUpdateCommandHandler(IResumeRepository resumeRepository, ICompetenceRepository competenceRepository, IMapper mapper, IRedisService redisService)
        {
            _resumeRepository = resumeRepository;
            _competenceRepository = competenceRepository;
            _mapper = mapper;
            _redisService = redisService;
        }

        public async Task<Resume> Handle(ResumeUpdateCommand request, CancellationToken cancellationToken)
        {
            Resume? resume = await _resumeRepository.GetAsync(x => x.Id == request.Id);

            if (resume is null)
            {
                throw new NotFoundException("Resume not found!");
            }

            //resume.ResumeCompetences.RemoveAll(x => x.ResumeId == request.Id);

            resume.Id = request.Id;
            resume.Title = request.Title ?? resume.Title;
            resume.Summary = request.Summary ?? resume.Summary;
            resume.Experience = request.Experience ?? resume.Experience;
            resume.Education = request.Education ?? resume.Education;
            resume.CvFilePath = request.CvFilePath ?? resume.CvFilePath;
            resume.UpdateTime = DateTime.UtcNow;

            var competences = await _competenceRepository.GetAllAsync(x => request.CompetenceIds.Contains(x.Id));

            if (competences.Count != request.CompetenceIds.Count)
            {
                throw new BusinessException("One or more competences not found!");
            }

            resume.ResumeCompetences.Clear();

            resume.ResumeCompetences = competences.Select(x => new ResumeCompetence
            {
                ResumeId = resume.Id,
                CompetenceId = x.Id,
                CompetenceName = x.Name
            }).ToList();

            await _resumeRepository.UpdateAsync(resume, cancellationToken);

            await _redisService.RemoveDataAsync("resumes");

            return resume;
        }
    }

}


