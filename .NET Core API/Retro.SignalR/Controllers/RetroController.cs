using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Retro.SignalR.Modals;
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
    public IActionResult Get(string RetroToken)
    {
      var result = _retroService.RetroGet(RetroToken);
      return Ok(result);
    }


    [HttpPost]
    public IActionResult Post(RetroSprintModal retro)
    {
      var result = _retroService.RetroAdd(retro);
      return Ok(result);
    }

  }
}
