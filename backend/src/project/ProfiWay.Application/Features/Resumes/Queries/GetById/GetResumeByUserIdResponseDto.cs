using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Resumes.Queries.GetById;

public class GetResumeByUserIdResponseDto
{
    public int Id { get; set; }
    public string Title { get; set; }
    public string Summary { get; set; }
    public string Experience { get; set; }
    public string Education { get; set; }
    public string? CvFilePath { get; set; }
    public List<ResumeCompetenceDto> ResumeCompetences { get; set; } = new();
    public string UserId { get; set; }
}
