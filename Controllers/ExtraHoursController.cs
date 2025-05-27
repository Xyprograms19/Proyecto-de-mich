// Controllers/ExtraHoursController.cs
using Microsoft.AspNetCore.Mvc;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExtraHours.API.Models;

namespace YourProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExtraHoursController : ControllerBase
    {
        private static List<ExtraHour> _extraHours = new List<ExtraHour>
        {
            new ExtraHour
            {
                Id = 1,
                UserId = 101,
                Date = new DateTime(2024, 5, 20),
                StartTime = new TimeSpan(18, 0, 0),
                EndTime = new TimeSpan(20, 0, 0),
                Reason = "Proyecto X - Finalización de fase",
                Status = "Aprobada",
                RequestedAt = new DateTime(2024, 5, 19, 10, 0, 0),
                ApprovedRejectedAt = new DateTime(2024, 5, 19, 15, 0, 0),
                ApprovedRejectedByUserId = 201
            },
            new ExtraHour
            {
                Id = 2,
                UserId = 102,
                Date = new DateTime(2024, 5, 21),
                StartTime = new TimeSpan(19, 0, 0),
                EndTime = new TimeSpan(21, 30, 0),
                Reason = "Mantenimiento de servidor urgente",
                Status = "Pendiente",
                RequestedAt = new DateTime(2024, 5, 20, 9, 0, 0)
            },
            new ExtraHour
            {
                Id = 3,
                UserId = 101,
                Date = new DateTime(2024, 5, 22),
                StartTime = new TimeSpan(17, 0, 0),
                EndTime = new TimeSpan(19, 0, 0),
                Reason = "Capacitación interna",
                Status = "Rechazada",
                RejectionReason = "No aplica para horas extras",
                RequestedAt = new DateTime(2024, 5, 21, 14, 0, 0),
                ApprovedRejectedAt = new DateTime(2024, 5, 21, 16, 0, 0),
                ApprovedRejectedByUserId = 202
            }
        };

        private static int _nextId = _extraHours.Max(eh => eh.Id) + 1;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraHour>>> GetExtraHours()
        {
            return Ok(_extraHours);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHour>> GetExtraHour(int id)
        {
            var extraHour = _extraHours.FirstOrDefault(eh => eh.Id == id);

            if (extraHour == null)
            {
                return NotFound();
            }

            return Ok(extraHour);
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHour>> PostExtraHour(ExtraHour extraHour)
        {
            extraHour.Id = _nextId++;
            extraHour.RequestedAt = DateTime.Now;
            if (extraHour.Status == null) extraHour.Status = "Pendiente";

            _extraHours.Add(extraHour);
            return CreatedAtAction(nameof(GetExtraHour), new { id = extraHour.Id }, extraHour);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutExtraHour(int id, ExtraHour extraHour)
        {
            if (id != extraHour.Id)
            {
                return BadRequest();
            }

            var existingExtraHour = _extraHours.FirstOrDefault(eh => eh.Id == id);
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
                    existingExtraHour.ApprovedRejectedByUserId = 999; // Simulado
                }
                else
                {
                    existingExtraHour.ApprovedRejectedAt = null;
                    existingExtraHour.ApprovedRejectedByUserId = null;
                }
            }

            return NoContent();
        }

        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteExtraHour(int id)
        {
            var extraHour = _extraHours.FirstOrDefault(eh => eh.Id == id);
            if (extraHour == null)
            {
                return NotFound();
            }

            _extraHours.Remove(extraHour);
            return NoContent();
        }
    }
}
