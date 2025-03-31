using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class JobPosting : Entity<int>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int CityId { get; set; }

    public Company Company { get; set; }
    public City City { get; set; }
    public List<Application> Applications { get; set; } = new();
    public List<JobPostingCompetence> JobPostingCompetences { get; set; } = new();
}

