using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Applications.Queries.GetListByUser;

public class GetListApplicationByUserIdResponseDto
{
    public int Id { get; set; }
    public int JobPostingId { get; set; }
    public ApplicationStatus Status { get; set; } = ApplicationStatus.Pending;
}
