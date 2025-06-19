using ExtraHours.API.Data;
using ExtraHours.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.API.Repositories;

public class ExtraHourRequestRepository : IExtraHourRequestRepository
{
    private readonly AppDbContext _context;

    public ExtraHourRequestRepository(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ExtraHourRequest> CreateAsync(ExtraHourRequest request)
    {
        _context.ExtraHourRequests.Add(request);
        await _context.SaveChangesAsync();
        return request;
    }

    public async Task<ExtraHourRequest?> GetByIdAsync(int id)
    {
        return await _context.ExtraHourRequests
            .Include(r => r.User)
            .FirstOrDefaultAsync(r => r.Id == id);
    }

    public async Task<IEnumerable<ExtraHourRequest>> GetAllAsync()
    {
        return await _context.ExtraHourRequests
            .Include(r => r.User)
            .ToListAsync();
    }
}