using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Companies.Commands.Create;
using ProfiWay.Application.Features.Companies.Commands.Delete;
using ProfiWay.Application.Features.Companies.Commands.Update;
using ProfiWay.Application.Features.Companies.Queries.GetById;
using ProfiWay.Application.Features.Companies.Queries.GetList;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CompaniesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(CompanyAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpPut("update")]
        public async Task<IActionResult> Update(CompanyUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(CompanyDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListCompanyQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(string id)
        {
            GetByIdCompanyQuery query = new() { UserId = id };
            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
