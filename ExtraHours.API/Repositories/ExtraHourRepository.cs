using ExtraHours.API.Models;
using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;

public class ExtraHourRepository : IExtraHourRepository
{
    private readonly AppDbContext _context;

    public ExtraHourRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<ExtraHour>> GetAllAsync()
    {
        return await _context.ExtraHours.ToListAsync();
    }

    public async Task<ExtraHour?> GetByIdAsync(int id)
    {
        return await _context.ExtraHours.FindAsync(id);
    }

    public async Task<ExtraHour> CreateAsync(ExtraHour extraHour)
    {
        _context.ExtraHours.Add(extraHour);
        await _context.SaveChangesAsync();
        return extraHour;
    }

    public async Task<ExtraHour?> UpdateAsync(int id, ExtraHour extraHour)
    {
        var existing = await _context.ExtraHours.FindAsync(id);
        if (existing == null) return null;
        // Actualiza campos necesarios
        existing.Status = extraHour.Status;
        // ...otros campos...
        await _context.SaveChangesAsync();
        return existing;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var existing = await _context.ExtraHours.FindAsync(id);
        if (existing == null) return false;
        _context.ExtraHours.Remove(existing);
        await _context.SaveChangesAsync();
        return true;
    }
}