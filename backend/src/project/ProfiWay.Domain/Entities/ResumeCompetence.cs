using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class ResumeCompetence : Entity<int>
{
    public int ResumeId { get; set; }
    public int CompetenceId { get; set; }

    public Resume Resume { get; set; }
    public Competence Competence { get; set; }
}

