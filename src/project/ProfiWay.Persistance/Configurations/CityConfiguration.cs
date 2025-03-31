
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Persistance.Configurations;

public class CityConfiguration : IEntityTypeConfiguration<City>
{
    public void Configure(EntityTypeBuilder<City> builder)
    {
        builder.Navigation(x => x.JobPostings).AutoInclude();
    }
}
