

using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class ResumeRepository : EfRepositoryBase<Resume, int, BaseDbContext>, IResumeRepository
{
    public ResumeRepository(BaseDbContext context) : base(context)
    {
    }
}
