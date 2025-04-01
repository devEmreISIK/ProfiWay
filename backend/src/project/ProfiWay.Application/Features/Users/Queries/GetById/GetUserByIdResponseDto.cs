namespace ProfiWay.Application.Features.Users.Queries.GetById;

public class GetUserByIdResponseDto
{
    public string FullName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }
    public DateTime CreatedTime { get; set; }
}
