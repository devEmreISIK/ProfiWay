

using Core.Persistance.Repositories;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Services.Repositories;

public interface ICompetenceRepository : IAsyncRepository<Competence, int>, IRepository<Competence, int>
{
}
