

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Persistance.Configurations;

public class JobPostingConfiguration : IEntityTypeConfiguration<JobPosting>
{
    public void Configure(EntityTypeBuilder<JobPosting> builder)
    {
        builder.Navigation(x => x.JobPostingCompetences).AutoInclude();
        builder.Navigation(x => x.Applications).AutoInclude();
    }
}
