using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Cities.Queries.GetListDetail;

public class GetListDetailCityResponseDto
{
    public int Id { get; set; }
    public string Name { get; set; }
    public List<JobPosting> JobPostings { get; set; } = new();
}
