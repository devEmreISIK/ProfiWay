using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Cities.Commands.Create;
using ProfiWay.Application.Features.Cities.Commands.Delete;
using ProfiWay.Application.Features.Cities.Commands.Update;
using ProfiWay.Application.Features.Cities.Queries.GetById;
using ProfiWay.Application.Features.Cities.Queries.GetList;
using ProfiWay.Application.Features.Cities.Queries.GetListDetail;
namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CitiesController(IMediator mediator) : ControllerBase
    {
        [HttpPost("add")]
        public async Task<IActionResult> Add(CityAddCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }
        [HttpPut("update")]
        public async Task<IActionResult> Update(CityUpdateCommand command)
        {
            var result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpDelete("delete")]
        public async Task<IActionResult> Delete(CityDeleteCommand command)
        {
            string result = await mediator.Send(command);
            return Ok(result);
        }

        [HttpGet("getall")]
        public async Task<IActionResult> GetAll()
        {
            GetListCityQuery query = new();

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyiddetails")]
        public async Task<IActionResult> GetAllDetails(int id)
        {
            GetByIdDetailCityQuery query = new() { Id = id };

            var result = await mediator.Send(query);

            return Ok(result);
        }

        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(int id)
        {
            GetByIdCityQuery query = new() { Id = id };
            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
