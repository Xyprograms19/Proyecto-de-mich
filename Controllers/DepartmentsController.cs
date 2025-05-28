
using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using ExtraHours.API.Models;

namespace YourProjectName.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    // [Authorize(Roles = "Admin")]
    public class DepartmentsController : ControllerBase
    {
        private static List<Department> _departments = new List<Department>
        {
            new Department { Id = 1, Name = "RRHH", Employees = 8, TotalExtraHours = 24, Status = "Activo" },
            new Department { Id = 2, Name = "Ventas", Employees = 12, TotalExtraHours = 36, Status = "Activo" },
            new Department { Id = 3, Name = "IT", Employees = 15, TotalExtraHours = 45, Status = "Activo" },
            new Department { Id = 4, Name = "Contabilidad", Employees = 5, TotalExtraHours = 15, Status = "Activo" },
        };
        private static int _nextId = _departments.Max(d => d.Id) + 1;

        [HttpGet]
        public async Task<ActionResult<IEnumerable<Department>>> GetDepartments()
        {
            return Ok(_departments);
        }


        [HttpGet("{id}")]
        public async Task<ActionResult<Department>> GetDepartment(int id)
        {
            var department = _departments.FirstOrDefault(d => d.Id == id);

            if (department == null)
            {
                return NotFound();
            }

            return Ok(department);
        }


        [HttpPost]
        public async Task<ActionResult<Department>> PostDepartment(Department department)
        {
            department.Id = _nextId++;
            _departments.Add(department);
            return CreatedAtAction(nameof(GetDepartment), new { id = department.Id }, department);
        }

        [HttpPut("{id}")]
        public async Task<IActionResult> PutDepartment(int id, Department department)
        {
            if (id != department.Id)
            {
                return BadRequest();
            }

            var existingDepartment = _departments.FirstOrDefault(d => d.Id == id);
            if (existingDepartment == null)
            {
                return NotFound();
            }


            existingDepartment.Name = department.Name;
            existingDepartment.Employees = department.Employees;
            existingDepartment.TotalExtraHours = department.TotalExtraHours;
            existingDepartment.Status = department.Status;

            return NoContent();
        }


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteDepartment(int id)
        {
            var department = _departments.FirstOrDefault(d => d.Id == id);
            if (department == null)
            {
                return NotFound();
            }

            _departments.Remove(department);
            return NoContent();
        }
    }
}