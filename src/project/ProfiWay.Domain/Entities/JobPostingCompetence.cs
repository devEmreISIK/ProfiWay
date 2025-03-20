using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class JobPostingCompetence : Entity<int>
{
    public int JobPostingId { get; set; }
    public int CompetenceId { get; set; }

    public JobPosting JobPosting { get; set; }
    public Competence Competence { get; set; }
}

