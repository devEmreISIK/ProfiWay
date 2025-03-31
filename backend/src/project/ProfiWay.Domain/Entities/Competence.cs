using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class Competence : Entity<int>
{
    public string Name { get; set; }
    public List<ResumeCompetence> ResumeCompetences { get; set; } = new();
    public List<JobPostingCompetence> JobPostingCompetences { get; set; } = new();
}

