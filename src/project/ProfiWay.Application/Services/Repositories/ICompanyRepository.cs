

using Core.Persistance.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.Repositories;

public interface ICompanyRepository : IAsyncRepository<Company, int>, IRepository<Company, int>
{
}
