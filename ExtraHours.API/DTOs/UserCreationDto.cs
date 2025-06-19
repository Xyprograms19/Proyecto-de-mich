using System.ComponentModel.DataAnnotations;
using ExtraHours.API.Models;

namespace ExtraHours.API.DTOs
{
    public class UserCreationDto
    {
        [Required]
        public string Username { get; set; }
        [Required]
        [EmailAddress]
        public string Email { get; set; }
        [Required]
        [MinLength(6)]
        public string Password { get; set; }
        public string FirstName { get; set; }
        public string LastName { get; set; }
        public UserRole Role { get; set; }
        public string Department { get; set; }
        public string Position { get; set; }
        public bool IsActive { get; set; } = true;
    }
}
