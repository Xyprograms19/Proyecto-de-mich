using ExtraHours.API.Models;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IDepartmentService
{
    Task<IEnumerable<Department>> GetAllAsync();
    Task<Department?> GetByIdAsync(int id);
    Task<Department> CreateAsync(Department department);
    Task<Department?> UpdateAsync(int id, Department department);
    Task<bool> DeleteAsync(int id);
}