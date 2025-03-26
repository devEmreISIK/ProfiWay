

namespace ProfiWay.Application.Features.JobPostings.Queries.GetList;

public class GetListJobPostingsResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Description { get; set; }
    public int CompanyId { get; set; }
    public int CityId { get; set; }
    public List<JobPostingCompetenceDto>? JobPostingCompetences { get; set; }
    public List<ApplicationsDto>? Applications { get; set; }
}

