using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.UserRoles.Commands.Create;
using ProfiWay.Application.Features.UserRoles.Commands.Delete;
using ProfiWay.Application.Features.UserRoles.Commands.Update;
using ProfiWay.Application.Features.UserRoles.Queries.GetByUserId;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class UserRolesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(UserRoleAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(UserRoleUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(UserRoleDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getbyuserid")]
        public async Task<IActionResult> GetAll(string id)
        {
            var response = new GetByUserIdUserRoleQuery { UserId = id };

            var result = await mediator.Send(response);
            return Ok(result);
        }
    }
}
