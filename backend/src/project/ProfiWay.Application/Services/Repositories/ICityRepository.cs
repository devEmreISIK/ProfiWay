
using Core.Persistance.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.Repositories;

public interface ICityRepository : IAsyncRepository<City, int>, IRepository<City, int>
{
}
