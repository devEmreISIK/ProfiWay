

using Core.Persistance.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.Repositories;

public interface IJobPostingRepository : IAsyncRepository<JobPosting, int>, IRepository<JobPosting, int>
{
}
