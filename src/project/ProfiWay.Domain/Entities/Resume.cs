using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class Resume : Entity<int>
{
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Experience { get; set; }
    public string Education { get; set; }
    public string? CvFilePath { get; set; }

    public string UserId { get; set; }
    public User User { get; set; }

    public List<ResumeCompetence> ResumeCompetences { get; set; } = new();
}

