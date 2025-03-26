

using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Persistance.Configurations;

public class ResumeConfiguration : IEntityTypeConfiguration<Resume>
{
    public void Configure(EntityTypeBuilder<Resume> builder)
    {
        builder.Navigation(x => x.ResumeCompetences).AutoInclude();
    }
}
