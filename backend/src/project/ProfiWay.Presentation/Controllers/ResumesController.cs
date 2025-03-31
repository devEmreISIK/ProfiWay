using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Resumes.Commands.Create;
using ProfiWay.Application.Features.Resumes.Commands.Delete;
using ProfiWay.Application.Features.Resumes.Commands.Update;
using ProfiWay.Application.Features.Resumes.Queries.GetById;
using ProfiWay.Application.Features.Resumes.Queries.GetList;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ResumesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(ResumeAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update(ResumeUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(ResumeDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListResumeQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(int id)
        {
            GetByIdResumeQuery query = new() { Id = id };
            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
