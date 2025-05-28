using System.ComponentModel.DataAnnotations;
using ExtraHours.API.Models;

namespace ExtraHours.API.DTOs
{
    public class UserUpdateDto
    {
        [Required]
        public int Id { get; set; }
        public string? Username { get; set; }
        [EmailAddress]
        public string? Email { get; set; }
        public string? FirstName { get; set; }
        public string? LastName { get; set; }
        public UserRole? Role { get; set; }
        public string? Department { get; set; }
        public string? Position { get; set; }
        public bool? IsActive { get; set; }
        public string? ProfilePictureUrl { get; set; }

    }
}