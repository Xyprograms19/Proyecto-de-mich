using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using System;
using Microsoft.AspNetCore.Authorization;

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

            return await _context.ExtraHours
                                .Include(eh => eh.User)
                                .Include(eh => eh.ApprovedBy)
                                .ToListAsync();
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

            return extraHour;
        }


        [HttpPost]
        public async Task<ActionResult<ExtraHour>> PostExtraHour(ExtraHour extraHour)
        {

            extraHour.CreatedAt = DateTime.UtcNow;
            extraHour.UpdatedAt = DateTime.UtcNow;

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