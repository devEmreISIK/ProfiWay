using AutoMapper;
using Core.CrossCuttingConcerns.Exceptions;
using MediatR;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Domain.Entities;

namespace ProfiWay.Application.Features.Users.Commands.Update;

public class UserInfoUpdateCommand : IRequest<string>
{
    public string Id { get; set; }
    public string FullName { get; set; }
    public string UserName { get; set; }
    public string Email { get; set; }
    public string PhoneNumber { get; set; }

    public class UserInfoUpdateCommandHandler : IRequestHandler<UserInfoUpdateCommand, string>
    {
        private readonly UserManager<User> _userManager;

        public UserInfoUpdateCommandHandler(UserManager<User> userManager)
        {
            _userManager = userManager;
        }

        public async Task<string> Handle(UserInfoUpdateCommand request, CancellationToken cancellationToken)
        {
            User? user = await _userManager.FindByIdAsync(request.Id);

            if (user is null)
            {
                throw new NotFoundException("User not found!");
            }

            user.Email = request.Email ?? user.Email;
            user.PhoneNumber = request.PhoneNumber ?? user.PhoneNumber;
            user.FullName = request.FullName ?? user.FullName;
            user.UserName = request.UserName ?? user.UserName;

            var result = await _userManager.UpdateAsync(user);

            return "Success!";
        }
    }
}
