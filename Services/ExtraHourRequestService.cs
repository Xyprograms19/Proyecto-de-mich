using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

public class ExtraHourRequestService : IExtraHourRequestService
{
    private readonly AppDbContext _context;

    public ExtraHourRequestService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<ExtraHourRequest> CreateAsync(int userId, ExtraHourRequestCreateDto requestDto)
    {
        var newRequest = new ExtraHourRequest
        {
            UserId = userId,
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
        return newRequest;
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