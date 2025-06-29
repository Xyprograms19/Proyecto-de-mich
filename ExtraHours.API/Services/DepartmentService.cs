// using ExtraHours.API.Data;
// using ExtraHours.API.Models;
// using Microsoft.EntityFrameworkCore;
// using System.Collections.Generic;
// using System.Threading.Tasks;

// namespace ExtraHours.API.Services;

// public class DepartmentService : IDepartmentService
// {
//     private readonly AppDbContext _context;

//     public DepartmentService(AppDbContext context)
//     {
//         _context = context;
//     }

//     public async Task<IEnumerable<Department>> GetAllAsync()
//     {
//         return await _context.Departments.ToListAsync();
//     }

//     public async Task<Department?> GetByIdAsync(int id)
//     {
//         return await _context.Departments.FindAsync(id);
//     }

//     public async Task<Department> CreateAsync(Department department)
//     {
//         _context.Departments.Add(department);
//         await _context.SaveChangesAsync();
//         return department;
//     }

//     public async Task<Department?> UpdateAsync(int id, Department department)
//     {
//         var existing = await _context.Departments.FindAsync(id);
//         if (existing == null) return null;

//         existing.Name = department.Name;
//         existing.Employees = department.Employees;
//         existing.Status = department.Status;

//         await _context.SaveChangesAsync();
//         return existing;
//     }

//     public async Task<bool> DeleteAsync(int id)
//     {
//         var department = await _context.Departments.FindAsync(id);
//         if (department == null) return false;
//         _context.Departments.Remove(department);
//         await _context.SaveChangesAsync();
//         return true;
//     }
// }

using ExtraHours.API.Repositories;
// ...otros usings...

public class DepartmentService : IDepartmentService
{
    private readonly IDepartmentRepository _repository;

    public DepartmentService(IDepartmentRepository repository)
    {
        _repository = repository;
    }

    public Task<IEnumerable<Department>> GetAllAsync()
        => _repository.GetAllAsync();

    public Task<Department?> GetByIdAsync(int id)
        => _repository.GetByIdAsync(id);

    public Task<Department> CreateAsync(Department department)
        => _repository.CreateAsync(department);

    public Task<Department?> UpdateAsync(int id, Department department)
        => _repository.UpdateAsync(id, department);

    public Task<bool> DeleteAsync(int id)
        => _repository.DeleteAsync(id);
}