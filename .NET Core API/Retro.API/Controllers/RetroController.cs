using Microsoft.AspNetCore.Mvc;

namespace Retrospective.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class RetroController : ControllerBase
    {

        [HttpGet]
        public IActionResult Get()
        {
            return Ok(true);
        }
            
        [HttpPost]
        public IActionResult Post()
        {
            return Ok(true);
        }
    }
}