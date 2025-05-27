
using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using System;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExtraHourRequestsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExtraHourRequestsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHourRequest>> CreateExtraHourRequest(ExtraHourRequestCreateDto requestDto)
        {

            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId))
            {
                return Unauthorized("User ID not found in token.");
            }


            int parsedUserId;


            if (!int.TryParse(userId, out parsedUserId))
            {
                return BadRequest("Invalid user ID format in token.");
            }



            var newRequest = new ExtraHourRequest
            {
                UserId = parsedUserId,
                DateOfExtraHours = requestDto.DateOfExtraHours,
                StartTime = requestDto.StartTime,
                EndTime = requestDto.EndTime,
                ExtraHourTypeId = requestDto.ExtraHourTypeId,
                Reason = requestDto.Reason,
                Status = "Pendiente",
                RequestDate = DateTime.UtcNow,
                AdminComments = null
            };

            _context.ExtraHourRequests.Add(newRequest);
            await _context.SaveChangesAsync();



            return CreatedAtAction(nameof(GetExtraHourRequest), new { id = newRequest.Id }, newRequest);
        }
        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHourRequest>> GetExtraHourRequest(int id)
        {
            var request = await _context.ExtraHourRequests
                .Include(r => r.User)

                .FirstOrDefaultAsync(r => r.Id == id);

            if (request == null)
            {
                return NotFound();
            }

            return Ok(request);
        }
    }
}