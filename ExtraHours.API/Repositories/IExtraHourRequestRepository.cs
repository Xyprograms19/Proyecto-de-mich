using ExtraHours.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

namespace ExtraHours.API.Repositories;

public interface IExtraHourRequestRepository
{
    Task<ExtraHourRequest> CreateAsync(ExtraHourRequest request);
    Task<ExtraHourRequest?> GetByIdAsync(int id);
    Task<IEnumerable<ExtraHourRequest>> GetAllAsync();
}