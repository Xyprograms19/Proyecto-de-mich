using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Models;
using ExtraHours.API.Services;
[Route("api/[controller]")]
[ApiController]
public class ExtraHoursController : ControllerBase
{
    private readonly IExtraHourService _extraHourService;

    public ExtraHoursController(IExtraHourService extraHourService)
    {
        _extraHourService = extraHourService;
    }

    [HttpGet]
    public async Task<ActionResult<IEnumerable<ExtraHour>>> GetExtraHours()
    {
        var result = await _extraHourService.GetAllAsync();
        return Ok(result);
    }

    [HttpGet("{id}")]
    public async Task<ActionResult<ExtraHour>> GetExtraHour(int id)
    {
        var extraHour = await _extraHourService.GetByIdAsync(id);
        if (extraHour == null) return NotFound();
        return Ok(extraHour);
    }

    [HttpPost]
    public async Task<ActionResult<ExtraHour>> PostExtraHour([FromBody] ExtraHour extraHour)
    {
        var created = await _extraHourService.CreateAsync(extraHour);
        return CreatedAtAction(nameof(GetExtraHour), new { id = created.Id }, created);
    }

    [HttpPut("{id}")]
    public async Task<IActionResult> PutExtraHour(int id, [FromBody] ExtraHour extraHour)
    {
        var updated = await _extraHourService.UpdateAsync(id, extraHour);
        if (updated == null) return NotFound();
        return NoContent();
    }

    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExtraHour(int id)
    {
        var deleted = await _extraHourService.DeleteAsync(id);
        if (!deleted) return NotFound();
        return NoContent();
    }
}