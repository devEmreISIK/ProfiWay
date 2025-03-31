
using Core.Persistance.Repositories;



namespace ProfiWay.Application.Services.Repositories;

public interface IApplicationRepository : IAsyncRepository<ProfiWay.Domain.Entities.Application, int>, IRepository<ProfiWay.Domain.Entities.Application, int>
{
}
