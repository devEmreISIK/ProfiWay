

using Core.Persistance.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.Repositories;

public interface IResumeRepository : IAsyncRepository<Resume, int>, IRepository<Resume, int>
{
}
