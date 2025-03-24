using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Companies.Queries.GetById;

public class GetByIdCompanyResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public string Industry { get; set; }
    public string Description { get; set; }
    public string UserId { get; set; }
    public List<JobPosting>? JobPostings { get; set; }
}
