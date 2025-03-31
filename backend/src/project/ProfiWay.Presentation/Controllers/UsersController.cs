﻿using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using ProfiWay.Application.Features.Users.Queries.GetById;

namespace ProfiWay.Presentation.Controllers
{
    [Route("api/[controller]")]
    [ApiController]

    
    public class UsersController(IMediator mediator) : ControllerBase
    {
        [HttpGet("getbyid")]
        public async Task<IActionResult> GetById(string id)
        {
            GetUserByIdQuery query = new GetUserByIdQuery()
            {
                Id = id
            };

            var result = await mediator.Send(query);

            return Ok(result);
        }
    }
}
