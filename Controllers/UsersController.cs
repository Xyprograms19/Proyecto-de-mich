
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using BCrypt.Net;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    // [Authorize] // Autenticación requerida para todas las acciones en este controlador
    public class UsersController : ControllerBase
    {
        private readonly AppDbContext _context;

        public UsersController(AppDbContext context)
        {
            _context = context;
        }


        [HttpGet]

        public async Task<ActionResult<IEnumerable<UserDto>>> GetUsers()
        {

            return await _context.Users
                                    .Select(u => new UserDto(u))
                                    .ToListAsync();
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<UserDto>> GetUser(int id)
        {
            var user = await _context.Users.FindAsync(id);

            if (user == null)
            {
                return NotFound();
            }


            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != null && int.Parse(userIdClaim) != id)
            {
                if (!User.IsInRole(UserRole.Admin.ToString()))
                {
                    return Forbid();
                }
            }

            return new UserDto(user);
        }


        [HttpPost]
        // [Authorize(Roles = "Admin")] // Solo administradores pueden crear usuarios
        public async Task<ActionResult<UserDto>> PostUser(UserCreationDto userDto)
        {

            if (await _context.Users.AnyAsync(u => u.Username == userDto.Username))
            {
                return BadRequest(new { message = "El nombre de usuario ya existe." });
            }
            if (await _context.Users.AnyAsync(u => u.Email == userDto.Email))
            {
                return BadRequest(new { message = "El correo electrónico ya existe." });
            }


            string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);


            var user = new User
            {
                Username = userDto.Username,
                Email = userDto.Email,
                PasswordHash = passwordHash,
                FirstName = userDto.FirstName,
                LastName = userDto.LastName,
                Role = userDto.Role,
                Department = userDto.Department,
                Position = userDto.Position,
                IsActive = userDto.IsActive,
                // ProfilePictureUrl = userDto.ProfilePictureUrl,
                CreatedAt = DateTime.UtcNow,
                UpdatedAt = DateTime.UtcNow
            };

            _context.Users.Add(user);
            await _context.SaveChangesAsync();


            return CreatedAtAction("GetUser", new { id = user.Id }, new UserDto(user));
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> PutUser(int id, UserUpdateDto userDto)
        {
            if (id != userDto.Id)
            {
                return BadRequest(new { message = "El ID en la URL no coincide con el ID del usuario proporcionado." });
            }

            var existingUser = await _context.Users.FindAsync(id);
            if (existingUser == null)
            {
                return NotFound();
            }


            var userIdClaim = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (userIdClaim != null && int.Parse(userIdClaim) != id && !User.IsInRole(UserRole.Admin.ToString()))
            {
                return Forbid();
            }


            if (userDto.Email != null && await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.Id != id))
            {
                return BadRequest(new { message = "El correo electrónico ya está en uso por otro usuario." });
            }
            if (userDto.Username != null && await _context.Users.AnyAsync(u => u.Username == userDto.Username && u.Id != id))
            {
                return BadRequest(new { message = "El nombre de usuario ya está en uso por otro usuario." });
            }


            existingUser.Username = userDto.Username ?? existingUser.Username;
            existingUser.Email = userDto.Email ?? existingUser.Email;
            existingUser.FirstName = userDto.FirstName ?? existingUser.FirstName;
            existingUser.LastName = userDto.LastName ?? existingUser.LastName;
            existingUser.Role = userDto.Role ?? existingUser.Role;
            existingUser.Department = userDto.Department ?? existingUser.Department;
            existingUser.Position = userDto.Position ?? existingUser.Position;
            existingUser.IsActive = userDto.IsActive ?? existingUser.IsActive;
            existingUser.ProfilePictureUrl = userDto.ProfilePictureUrl ?? existingUser.ProfilePictureUrl;
            existingUser.UpdatedAt = DateTime.UtcNow;

            _context.Entry(existingUser).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!UserExists(id))
                {
                    return NotFound();
                }
                else
                {
                    throw;
                }
            }

            return NoContent();
        }


        [HttpDelete("{id}")]
        // [Authorize(Roles = "Admin")] // Solo administradores pueden eliminar usuarios
        public async Task<IActionResult> DeleteUser(int id)
        {
            var user = await _context.Users.FindAsync(id);
            if (user == null)
            {
                return NotFound();
            }

            _context.Users.Remove(user);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool UserExists(int id)
        {
            return _context.Users.Any(e => e.Id == id);
        }
    }
}