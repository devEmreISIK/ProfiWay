using Core.Persistance.Entities;
using System.Text.Json.Serialization;

namespace ProfiWay.Domain.Entities;

public class ResumeCompetence : Entity<int>
{
    public int ResumeId { get; set; }
    public int CompetenceId { get; set; }
    public string CompetenceName { get; set; }

    [JsonIgnore]
    public Resume Resume { get; set; }
    [JsonIgnore]
    public Competence Competence { get; set; }
}

