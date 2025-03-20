
using Core.Persistance.Repositories;
using ProfiWay.Application.Services.Repositories;
using ProfiWay.Domain.Entities;
using ProfiWay.Persistance.Contexts;

namespace ProfiWay.Persistance.Repositories;

public sealed class CompanyRepository : EfRepositoryBase<Company, int, BaseDbContext>, ICompanyRepository
{
    public CompanyRepository(BaseDbContext context) : base(context)
    {
    }
}
