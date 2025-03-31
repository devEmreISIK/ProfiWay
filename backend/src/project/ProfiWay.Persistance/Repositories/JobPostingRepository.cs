

using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class JobPostingRepository : EfRepositoryBase<JobPosting, int, BaseDbContext>, IJobPostingRepository
{
    public JobPostingRepository(BaseDbContext context) : base(context)
    {
    }
}
