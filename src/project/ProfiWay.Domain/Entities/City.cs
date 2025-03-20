using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class City : Entity<int>
{
    public string Name { get; set; }

    public List<JobPosting> JobPostings { get; set; } = new();
}

