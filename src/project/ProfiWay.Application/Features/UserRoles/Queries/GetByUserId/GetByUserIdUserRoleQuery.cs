
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.UserRoles.Queries.GetByUserId;

public class GetByUserIdUserRoleQuery : IRequest<GetByIdUserRoleResponse>
{
    public string UserId { get; set; }

    public class GetByUserIdUserRoleQueryHandler : IRequestHandler<GetByUserIdUserRoleQuery, GetByIdUserRoleResponse>
    {
        private readonly UserManager<User> _userManager;

        public GetByUserIdUserRoleQueryHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }
        public async Task<GetByIdUserRoleResponse> Handle(GetByUserIdUserRoleQuery request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.UserId);

            if (user is null)
            {
                throw new NotFoundException("Kullanıcı bulunamadı.");
            }

            var roles = await _userManager.GetRolesAsync(user);

            GetByIdUserRoleResponse response = new GetByIdUserRoleResponse()
            {
                UserName = user.UserName,
                Email = user.Email,
                IsJobSeeker = user.IsJobSeeker,
                Roles = roles
            };

            return response;
        }
    }
}
