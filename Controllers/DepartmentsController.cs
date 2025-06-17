using Microsoft.AspNetCore.Mvc;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using Microsoft.EntityFrameworkCore;
using System.Linq;
using System.Threading.Tasks;
using System;

namespace ExtraHours.API.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class DepartmentsController : ControllerBase
    {
        private readonly AppDbContext _context;

        public DepartmentsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<IActionResult> GetDepartments()
        {
            var departments = await _context.Departments.ToListAsync();
            var users = await _context.Users.ToListAsync();
            var extraHours = await _context.ExtraHours.ToListAsync();

            var result = departments.Select(d => new Department
            {
                Id = d.Id,
                Name = d.Name,
                Employees = d.Employees,
                Status = d.Status,
                TotalExtraHours = (int)Math.Round(
                    extraHours
                        .Where(eh => users.Any(u => u.Id == eh.UserId && u.Department == d.Name))
                        .Sum(eh => (eh.EndTime - eh.StartTime).TotalHours)
                )
            }).ToList();

            return Ok(result);
        }


        [HttpPost]
        public async Task<IActionResult> CreateDepartment([FromBody] Department department)
        {
            _context.Departments.Add(department);
            await _context.SaveChangesAsync();
            return Ok(department);
        }


        [HttpPut("{id}")]
        public async Task<IActionResult> UpdateDepartment(int id, [FromBody] Department department)
        {
            var existing = await _context.Departments.FindAsync(id);
            if (existing == null)
                return NotFound();

            existing.Name = department.Name;
            existing.Employees = department.Employees;
            existing.Status = department.Status;

            await _context.SaveChangesAsync();
            return Ok(existing);
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = await _context.Departments.FindAsync(id);
            if (department == null)
                return NotFound();

            _context.Departments.Remove(department);
            await _context.SaveChangesAsync();
            return NoContent();
        }
    }
}