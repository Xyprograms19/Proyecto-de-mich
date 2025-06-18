using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IExtraHourRequestService
{
    Task<ExtraHourRequest> CreateAsync(int userId, ExtraHourRequestCreateDto requestDto);
    Task<ExtraHourRequest?> GetByIdAsync(int id);
    Task<IEnumerable<ExtraHourRequest>> GetAllAsync();
}