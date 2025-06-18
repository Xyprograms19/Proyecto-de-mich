using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.DTOs;
using ExtraHours.API.Models;
using System.Threading.Tasks;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost("register")]
        public async Task<ActionResult<User>> Register(RegisterRequest request)
        {
            var user = await _authService.RegisterAsync(request);
            if (user == null)
                return BadRequest("El nombre de usuario o el correo electrónico ya están registrados.");
            user.PasswordHash = null;
            return CreatedAtAction(nameof(Register), user);
        }

        [HttpPost("login")]
        public async Task<IActionResult> Login([FromBody] LoginRequest request)
        {
            var (token, user) = await _authService.LoginAsync(request, request.RememberMe);
            if (token == null || user == null)
                return Unauthorized(new { message = "Credenciales inválidas." });

            return Ok(new
            {
                token,
                role = user.Role.ToString(),
                userId = user.Id,
                username = user.Username,
                email = user.Email,
                firstName = user.FirstName,
                lastName = user.LastName,
                department = user.Department,
                position = user.Position,
            });
        }
    }
}