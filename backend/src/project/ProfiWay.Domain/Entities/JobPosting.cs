using Core.Persistance.Entities;
using System.Text.Json.Serialization;

namespace ProfiWay.Domain.Entities;

public class JobPosting : Entity<int>
{
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int? CityId { get; set; }

    public Company Company { get; set; }
    public City City { get; set; }
    [JsonIgnore]
    public List<Application> Applications { get; set; } = new();
    [JsonIgnore]
    public List<JobPostingCompetence> JobPostingCompetences { get; set; } = new();
}

