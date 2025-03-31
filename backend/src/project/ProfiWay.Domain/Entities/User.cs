using Microsoft.AspNetCore.Identity;

namespace ProfiWay.Domain.Entities;

public class User : IdentityUser
{
    public string FullName { get; set; }
    public bool IsJobSeeker { get; set; }

    public int? CompanyId { get; set; }  // Could be null

    public Company? Company { get; set; }
    public Resume? Resume { get; set; }
    public List<Application>? Applications { get; set; }
}

