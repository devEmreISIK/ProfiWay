using MediatR;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Competences.Commands.Create;
using ProfiWay.Application.Features.Competences.Commands.Delete;
using ProfiWay.Application.Features.Competences.Commands.Update;
using ProfiWay.Application.Features.Competences.Queries.GetById;
using ProfiWay.Application.Features.Competences.Queries.GetList;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompetencesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(CompetenceAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update(CompetenceUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(CompetenceDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListCompetenceQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(int id)
        {
            GetByIdCompetenceQuery query = new() { Id = id };
            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
