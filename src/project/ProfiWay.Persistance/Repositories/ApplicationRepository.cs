

using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class ApplicationRepository : EfRepositoryBase<ProfiWay.Domain.Entities.Application, int, BaseDbContext>, IApplicationRepository
{
    public ApplicationRepository(BaseDbContext context) : base(context)
    {
    }
}
