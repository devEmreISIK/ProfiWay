

using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class CityRepository : EfRepositoryBase<City, int, BaseDbContext>, ICityRepository
{
    public CityRepository(BaseDbContext context) : base(context)
    {
    }
}
