

namespace Core.Persistance.DTOs;

public class PaginatedListDto<T>
{
    public List<T> Items { get; set; }
    public int TotalCount { get; set; }
}
