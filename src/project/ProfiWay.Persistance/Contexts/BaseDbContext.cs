using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Identity.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore;
using ProfiWay.Domain.Entities;
using System.Reflection;
using System.Reflection.Emit;

namespace ProfiWay.Persistance.Contexts;

public class BaseDbContext : IdentityDbContext<User, IdentityRole, string>
{
    public BaseDbContext(DbContextOptions options) : base(options)
    {
        
    }

    public DbSet<User> Users { get; set; } 
    public DbSet<Company> Companies { get; set; }
    public DbSet<JobPosting> JobPostings { get; set; }
    public DbSet<Application> Applications { get; set; }
    public DbSet<Resume> Resumes { get; set; }
    public DbSet<Competence> Competences { get; set; }
    public DbSet<ResumeCompetence> ResumeCompetences { get; set; }
    public DbSet<JobPostingCompetence> JobPostingCompetences { get; set; }
    public DbSet<City> Cities { get; set; }

    protected override void OnModelCreating(ModelBuilder builder)
    {

        base.OnModelCreating(builder);
        builder.ApplyConfigurationsFromAssembly(Assembly.GetExecutingAssembly());


        // Company - User (Firma yetkilisi)
        builder.Entity<Company>()
            .HasOne(c => c.User)
            .WithOne(u => u.Company)
            .HasForeignKey<Company>(c => c.UserId)
            .OnDelete(DeleteBehavior.Restrict);

        // User - Resume (Bir iş arayanın sadece 1 CV'si olabilir)
        builder.Entity<User>()
            .HasOne(u => u.Resume)
            .WithOne(r => r.User)
            .HasForeignKey<Resume>(r => r.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // User - Application (Bir iş arayanın birden fazla başvurusu olabilir)
        builder.Entity<User>()
            .HasMany(u => u.Applications)
            .WithOne(a => a.User)
            .HasForeignKey(a => a.UserId)
            .OnDelete(DeleteBehavior.Cascade);

        // JobPosting - Application (Bir iş ilanına birden fazla başvuru olabilir)
        builder.Entity<JobPosting>()
            .HasMany(jp => jp.Applications)
            .WithOne(a => a.JobPosting)
            .HasForeignKey(a => a.JobPostingId)
            .OnDelete(DeleteBehavior.Cascade);

        // Resume - ResumeCompetence (Many-to-Many)
        builder.Entity<ResumeCompetence>()
            .HasOne(rc => rc.Resume)
            .WithMany(r => r.ResumeCompetences)
            .HasForeignKey(rc => rc.ResumeId);

        builder.Entity<ResumeCompetence>()
            .HasOne(rc => rc.Competence)
            .WithMany()
            .HasForeignKey(rc => rc.CompetenceId);

        // JobPosting - JobPostingCompetence (Many-to-Many)
        builder.Entity<JobPostingCompetence>()
            .HasOne(jpc => jpc.JobPosting)
            .WithMany(jp => jp.JobPostingCompetences)
            .HasForeignKey(jpc => jpc.JobPostingId);

        builder.Entity<JobPostingCompetence>()
            .HasOne(jpc => jpc.Competence)
            .WithMany()
            .HasForeignKey(jpc => jpc.CompetenceId);

        // City - JobPosting (Bir şehirde birden fazla ilan olabilir)
        builder.Entity<City>()
            .HasMany(c => c.JobPostings)
            .WithOne(jp => jp.City)
            .HasForeignKey(jp => jp.CityId)
            .OnDelete(DeleteBehavior.Restrict);

        // ApplicationStatus enum'unu integer olarak sakla
        builder.Entity<Application>()
            .Property(a => a.Status)
            .HasConversion<int>();
    }

}
