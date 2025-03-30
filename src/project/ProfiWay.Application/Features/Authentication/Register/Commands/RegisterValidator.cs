

using FluentValidation;
using System.Text.RegularExpressions;

namespace ProfiWay.Application.Features.Authentication.Register.Commands;

public class RegisterValidator : AbstractValidator<RegisterCommand>
{
    public RegisterValidator()
    {
        RuleFor(x => x.Email).NotEmpty().WithMessage("Email field cannot be empty.")
            .Must(x => EmailFormat(x)).WithMessage("Email format is not correct.");

        RuleFor(x => x.Password).NotEmpty().WithMessage("Password field cannot be emtpy.")
            .MinimumLength(6).WithMessage("Password must be at least 6 characters.");

        RuleFor(x => x.UserName).NotEmpty().WithMessage("Username field cannot be empty")
            .Must(x => UserNameFormat(x)).WithMessage("Username format is not correct.")
            .MinimumLength(3).WithMessage("Username must be at least 3 characters.")
            .MaximumLength(12).WithMessage("Username can be maximum 12 characters.");

        RuleFor(x => x.FullName).NotEmpty().WithMessage("Username field cannot be empty")
            .Must(x => FullNameFormat(x)).WithMessage("Fullname format is not correct.")
            .MinimumLength(2).WithMessage("Username must be at least 2 characters.")
            .MaximumLength(50).WithMessage("Username can be maximum 50 characters.");
    }

    private bool EmailFormat(string email)
    {
        string pattern = @"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$";
        return Regex.IsMatch(email, pattern);
    }

    private bool UserNameFormat(string username)
    {
        string pattern = @"^[a-zA-Z0-9]{3,20}$";
        return Regex.IsMatch(username, pattern);
    }

    private bool FullNameFormat(string fullName)
    {
        string pattern = @"^[A-Za-zÇĞİÖŞÜçğıöşü]+(?:\s[A-Za-zÇĞİÖŞÜçğıöşü]+)+$";
        return Regex.IsMatch(fullName, pattern);
    }
}
