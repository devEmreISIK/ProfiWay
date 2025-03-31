using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Users.Queries.GetById;

public class GetUserByIdQuery : IRequest<GetUserByIdResponseDto>
{
    public string Id { get; set; }

    public class GetUserByIdQueryHandler : IRequestHandler<GetUserByIdQuery, GetUserByIdResponseDto>
    {
        private readonly UserManager<User> _userManager;
        private readonly IMapper _mapper;

        public GetUserByIdQueryHandler(UserManager<User> userManager, IMapper mapper)
        {
            _userManager = userManager;
            _mapper = mapper;
        }

        public async Task<GetUserByIdResponseDto> Handle(GetUserByIdQuery request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.Id);

            if (user is null)
            {
                throw new NotFoundException("User Not found.");
            }

            var response = _mapper.Map<GetUserByIdResponseDto>(user);

            return response;
        }
    }
}
