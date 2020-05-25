using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retrospective;

namespace Retro.SignalR.Controllers
{
  [Route("api/[controller]")]
  [ApiController]
  public class RetroController : ControllerBase
  {
    readonly IRetroService _retroService;

    public RetroController(IRetroService retroService)
    {
      _retroService = retroService;
    }

    // GET: api/Retro/5
    [HttpGet]
    public IActionResult Get(int sprintId)
    {
      var result = _retroService.RetroGet(sprintId);
      return Ok(result);
    }

  }
}
