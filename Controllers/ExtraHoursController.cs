using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExtraHours.API.Models;
using ExtraHours.API.Data;
using Microsoft.EntityFrameworkCore;

namespace ExtraHours.API.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtraHoursController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExtraHoursController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraHour>>> GetExtraHours([FromQuery] int? userId = null)
        {

            IQueryable<ExtraHour> query = _context.ExtraHours;


            if (userId.HasValue)
            {

                query = query.Where(eh => eh.UserId == userId.Value);
            }


            return await query.ToListAsync();
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHour>> GetExtraHour(int id)
        {
            var extraHour = await _context.ExtraHours.FindAsync(id);

            if (extraHour == null)
            {
                return NotFound();
            }

            return extraHour;
        }

        [HttpGet("departments")]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            var users = await _context.Users.ToListAsync();
            var extraHours = await _context.ExtraHours.ToListAsync();

            var result = departments.Select(d => new Department
            {
                Id = d.Id,
                Name = d.Name,
                Employees = d.Employees,
                Status = d.Status,
                TotalExtraHours = (int)Math.Round(
                    extraHours
                        .Where(eh => users.Any(u => u.Id == eh.UserId && u.Department == d.Name))
                        .Sum(eh => (eh.EndTime - eh.StartTime).TotalHours)
                )
            }).ToList();

            return Ok(result);
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHour>> PostExtraHour([FromBody] ExtraHour extraHour)
        {
            extraHour.RequestedAt = DateTime.Now;

            if (string.IsNullOrEmpty(extraHour.Status))
                extraHour.Status = "Pendiente";

            _context.ExtraHours.Add(extraHour);
            await _context.SaveChangesAsync();

            return CreatedAtAction(nameof(GetExtraHour), new { id = extraHour.Id }, extraHour);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtraHour(int id, ExtraHour extraHour)
        {
            if (id != extraHour.Id)
            {
                return BadRequest();
            }

            var existingExtraHour = await _context.ExtraHours.FindAsync(id);
            if (existingExtraHour == null)
            {
                return NotFound();
            }

            existingExtraHour.Date = extraHour.Date;
            existingExtraHour.StartTime = extraHour.StartTime;
            existingExtraHour.EndTime = extraHour.EndTime;
            existingExtraHour.Reason = extraHour.Reason;
            existingExtraHour.Status = extraHour.Status;
            existingExtraHour.RejectionReason = extraHour.RejectionReason;

            if (existingExtraHour.Status != extraHour.Status)
            {
                if (extraHour.Status == "Aprobada" || extraHour.Status == "Rechazada")
                {
                    existingExtraHour.ApprovedRejectedAt = DateTime.Now;
                    existingExtraHour.ApprovedRejectedByUserId = extraHour.ApprovedRejectedByUserId ?? 999;
                }
                else
                {
                    existingExtraHour.ApprovedRejectedAt = null;
                    existingExtraHour.ApprovedRejectedByUserId = null;
                }
            }

            await _context.SaveChangesAsync();
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

            _context.ExtraHours.Remove(extraHour);
            await _context.SaveChangesAsync();

            return NoContent();
        }
    }
}
