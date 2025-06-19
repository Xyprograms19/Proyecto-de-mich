using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using System.Threading.Tasks;
using System.Security.Claims;
using Microsoft.AspNetCore.Authorization;
using System.Collections.Generic;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    [Authorize]
    public class ExtraHourRequestsController : ControllerBase
    {
        private readonly IExtraHourRequestService _service;

        public ExtraHourRequestsController(IExtraHourRequestService service)
        {
            _service = service;
        }

        [HttpPost]
        public async Task<ActionResult<ExtraHourRequest>> CreateExtraHourRequest(ExtraHourRequestCreateDto requestDto)
        {
            var userId = User.FindFirst(ClaimTypes.NameIdentifier)?.Value;
            if (string.IsNullOrEmpty(userId) || !int.TryParse(userId, out int parsedUserId))
            {
                return Unauthorized("User ID not found in token.");
            }

            var newRequest = await _service.CreateAsync(parsedUserId, requestDto);
            return CreatedAtAction(nameof(GetExtraHourRequest), new { id = newRequest.Id }, newRequest);
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<ExtraHourRequest>> GetExtraHourRequest(int id)
        {
            var request = await _service.GetByIdAsync(id);
            if (request == null)
            {
                return NotFound();
            }
            return Ok(request);
        }

        [HttpGet]
        public async Task<ActionResult<IEnumerable<ExtraHourRequest>>> GetAllExtraHourRequests()
        {
            var requests = await _service.GetAllAsync();
            return Ok(requests);
        }
    }
}