using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Applications.Commands.Create;
using ProfiWay.Application.Features.Applications.Commands.Delete;
using ProfiWay.Application.Features.Applications.Commands.Update;
using ProfiWay.Application.Features.Applications.Queries.GetList;


namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ApplicationsController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(ApplicationAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(ApplicationUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(ApplicationDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getallbyjobpostings")]
        public async Task<IActionResult> GetAll(int id)
        {
            GetListApplicationByJobPostingQuery query = new() { JobPostingId = id };

            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
