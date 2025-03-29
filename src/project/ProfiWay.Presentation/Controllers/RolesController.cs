using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Roles.Commands.Create;
using ProfiWay.Application.Features.Roles.Commands.Delete;
using ProfiWay.Application.Features.Roles.Commands.Update;
using ProfiWay.Application.Features.Roles.Queries.GetList;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(RoleAddCommand command)
        {
            var result = await mediator.Send(command);

            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(RoleUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(RoleDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListRoleQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
