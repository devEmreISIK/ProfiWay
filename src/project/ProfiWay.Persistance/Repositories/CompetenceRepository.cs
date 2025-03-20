

using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class CompetenceRepository : EfRepositoryBase<Competence, int, BaseDbContext>, ICompetenceRepository
{
    public CompetenceRepository(BaseDbContext context) : base(context)
    {
    }
}
