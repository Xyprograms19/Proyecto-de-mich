using Microsoft.AspNetCore.Mvc;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class TestController : ControllerBase
    {
        [HttpGet("hello")]
        public IActionResult GetHello()
        {
            return Ok("Hello from TestController!");
        }
    }
}