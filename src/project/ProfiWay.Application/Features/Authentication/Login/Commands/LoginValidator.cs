

using FluentValidation;
using System.Text.RegularExpressions;

namespace ProfiWay.Application.Features.Authentication.Login.Commands;

public class LoginValidator : AbstractValidator<LoginCommand>
{
    public LoginValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email field cannot be empty.")
            .Must(x => EmailFormat(x)).WithMessage("Email format is not correct.");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password field cannot be emtpy.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");
    }

    private bool EmailFormat(string email)
    {
        string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        return Regex.IsMatch(email, pattern);
    }
}
