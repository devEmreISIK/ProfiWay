using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class Company : Entity<int>
{
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }
    public string UserId { get; set; }
            
    public User User { get; set; }
    public List<JobPosting> JobPostings { get; set; } = new();

}

