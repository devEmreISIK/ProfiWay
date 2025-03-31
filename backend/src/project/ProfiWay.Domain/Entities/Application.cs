using Core.Persistance.Entities;

namespace ProfiWay.Domain.Entities;

public class Application : Entity<int>
{
    public string UserId { get; set; }
    public int JobPostingId { get; set; }

    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;

    public User User { get; set; }
    public JobPosting JobPosting { get; set; }
}

