// using ExtraHours.API.Data;
// using ExtraHours.API.Models;
// using ExtraHours.API.DTOs;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;
// using System.Threading.Tasks;
// using System;

// namespace ExtraHours.API.Services;

// public class ExtraHourRequestService : IExtraHourRequestService
// {
//     private readonly AppDbContext _context;

//     public ExtraHourRequestService(AppDbContext context)
//     {
//         _context = context;
//     }

//     public async Task<ExtraHourRequest> CreateAsync(int userId, ExtraHourRequestCreateDto requestDto)
//     {
//         var newRequest = new ExtraHourRequest
//         {
//             UserId = userId,
//             DateOfExtraHours = requestDto.DateOfExtraHours,
//             StartTime = requestDto.StartTime,
//             EndTime = requestDto.EndTime,
//             ExtraHourTypeId = requestDto.ExtraHourTypeId,
//             Reason = requestDto.Reason,
//             Status = "Pendiente",
//             RequestDate = DateTime.UtcNow,
//             AdminComments = string.Empty
//         };

//         _context.ExtraHourRequests.Add(newRequest);
//         await _context.SaveChangesAsync();
//         return newRequest;
//     }

//     public async Task<ExtraHourRequest?> GetByIdAsync(int id)
//     {
//         return await _context.ExtraHourRequests
//             .Include(r => r.User)
//             .FirstOrDefaultAsync(r => r.Id == id);
//     }

//     public async Task<IEnumerable<ExtraHourRequest>> GetAllAsync()
//     {
//         return await _context.ExtraHourRequests
//             .Include(r => r.User)
//             .ToListAsync();
//     }
// }

using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using ExtraHours.API.Repositories;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

namespace ExtraHours.API.Services;

public class ExtraHourRequestService : IExtraHourRequestService
{
    private readonly IExtraHourRequestRepository _repository;

    public ExtraHourRequestService(IExtraHourRequestRepository repository)
    {
        _repository = repository;
    }

    public async Task<ExtraHourRequest> CreateAsync(int userId, ExtraHourRequestCreateDto requestDto)
    {
        var newRequest = new ExtraHourRequest
        {
            UserId = userId,
            DateOfExtraHours = requestDto.DateOfExtraHours,
            StartTime = requestDto.StartTime,
            EndTime = requestDto.EndTime,
            // ExtraHourTypeId = requestDto.ExtraHourTypeId,
            Reason = requestDto.Reason,
            Status = "Pendiente",
            RequestDate = DateTime.UtcNow,
            AdminComments = string.Empty
        };

        return await _repository.CreateAsync(newRequest);
    }

    public Task<ExtraHourRequest?> GetByIdAsync(int id)
        => _repository.GetByIdAsync(id);

    public Task<IEnumerable<ExtraHourRequest>> GetAllAsync()
        => _repository.GetAllAsync();
}