using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.JobPostings.Commands.Create;
using ProfiWay.Application.Features.JobPostings.Commands.Delete;
using ProfiWay.Application.Features.JobPostings.Commands.Update;
using ProfiWay.Application.Features.JobPostings.Queries.GetById;
using ProfiWay.Application.Features.JobPostings.Queries.GetList;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class JobPostingsController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(JobPostingAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update(JobPostingUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(JobPostingDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListJobPostingsQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(int id)
        {
            GetByIdJobPostingsQuery query = new() { Id = id };
            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
