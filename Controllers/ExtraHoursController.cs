using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using Microsoft.AspNetCore.Authorization;
using System.Security.Claims;
using System;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExtraHoursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExtraHoursController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraHour>>> GetExtraHours()
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null)
            {
                return Unauthorized();
            }

            var extraHoursQuery = _context.ExtraHours
                                           .Include(eh => eh.User)
                                           .Include(eh => eh.ApprovedBy)
                                           .AsQueryable();

            if (User.IsInRole(UserRole.Employee.ToString()))
            {
                extraHoursQuery = extraHoursQuery.Where(eh => eh.UserId == int.Parse(currentUserId));
            }

            return await extraHoursQuery.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHour>> GetExtraHour(int id)
        {
            var extraHour = await _context.ExtraHours
                                          .Include(eh => eh.User)
                                          .Include(eh => eh.ApprovedBy)
                                          .FirstOrDefaultAsync(eh => eh.Id == id);

            if (extraHour == null)
            {
                return NotFound();
            }

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null) return Unauthorized();

            if (extraHour.UserId != int.Parse(currentUserId) &&
                !User.IsInRole(UserRole.Manager.ToString()) &&
                !User.IsInRole(UserRole.Admin.ToString()))
            {
                return Forbid();
            }

            return extraHour;
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHour>> PostExtraHour(ExtraHour extraHour)
        {
            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null) return Unauthorized();

            if (extraHour.UserId != int.Parse(currentUserId))
            {
                return BadRequest("No puedes registrar horas extras para otro usuario.");
            }

            extraHour.CreatedAt = DateTime.UtcNow;
            extraHour.UpdatedAt = DateTime.UtcNow;
            extraHour.Status = ExtraHourStatus.Pending;

            _context.ExtraHours.Add(extraHour);
            await _context.SaveChangesAsync();

            return CreatedAtAction("GetExtraHour", new { id = extraHour.Id }, extraHour);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtraHour(int id, ExtraHour extraHour)
        {
            if (id != extraHour.Id)
            {
                return BadRequest();
            }

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null) return Unauthorized();

            var existingExtraHour = await _context.ExtraHours.AsNoTracking().FirstOrDefaultAsync(eh => eh.Id == id);
            if (existingExtraHour == null) return NotFound();

            if (User.IsInRole(UserRole.Employee.ToString()))
            {
                if (existingExtraHour.UserId != int.Parse(currentUserId))
                {
                    return Forbid("No tienes permiso para modificar las horas de otro usuario.");
                }
                if (extraHour.Status != existingExtraHour.Status || extraHour.ApprovedById.HasValue)
                {
                    return Forbid("Un empleado no puede cambiar el estado de la solicitud ni aprobarla.");
                }
                if (existingExtraHour.Status != ExtraHourStatus.Pending)
                {
                    return BadRequest("No puedes modificar una solicitud que ya ha sido procesada.");
                }
            }
            else if (User.IsInRole(UserRole.Manager.ToString()) || User.IsInRole(UserRole.Admin.ToString()))
            {
                if (extraHour.Status != existingExtraHour.Status)
                {
                    if (extraHour.Status == ExtraHourStatus.Approved || extraHour.Status == ExtraHourStatus.Rejected)
                    {
                        extraHour.ApprovedById = int.Parse(currentUserId);
                        extraHour.ApprovedAt = DateTime.UtcNow;
                    }
                    else
                    {
                        extraHour.ApprovedById = null;
                        extraHour.ApprovedAt = null;
                    }
                }
                else
                {
                    extraHour.ApprovedById = existingExtraHour.ApprovedById;
                    extraHour.ApprovedAt = existingExtraHour.ApprovedAt;
                }
            }
            else
            {
                return Forbid();
            }

            extraHour.UpdatedAt = DateTime.UtcNow;

            _context.Entry(extraHour).State = EntityState.Modified;

            try
            {
                await _context.SaveChangesAsync();
            }
            catch (DbUpdateConcurrencyException)
            {
                if (!ExtraHourExists(id))
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
        public async Task<IActionResult> DeleteExtraHour(int id)
        {
            var extraHour = await _context.ExtraHours.FindAsync(id);
            if (extraHour == null)
            {
                return NotFound();
            }

            var currentUserId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (currentUserId == null) return Unauthorized();

            if (!User.IsInRole(UserRole.Manager.ToString()) && !User.IsInRole(UserRole.Admin.ToString()))
            {
                if (extraHour.UserId != int.Parse(currentUserId) || extraHour.Status != ExtraHourStatus.Pending)
                {
                    return Forbid();
                }
            }

            _context.ExtraHours.Remove(extraHour);
            await _context.SaveChangesAsync();

            return NoContent();
        }

        private bool ExtraHourExists(int id)
        {
            return _context.ExtraHours.Any(e => e.Id == id);
        }
    }
}
