namespace ProfiWay.Application.Features.UserRoles.Queries.GetByUserId;

public class GetByIdUserRoleResponse
{
    public string UserName { get; set; }
    public string Email { get; set; }
    public bool IsJobSeeker { get; set; }

    public IList<string> Roles { get; set; }
}
