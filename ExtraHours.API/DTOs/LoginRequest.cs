using System.ComponentModel.DataAnnotations;

namespace ExtraHours.API.DTOs
{
    public class LoginRequest
    {
        [Required]
        public string UsernameOrEmail { get; set; } = string.Empty;

        [Required]
        public string Password { get; set; } = string.Empty;

        public bool RememberMe { get; set; } = false;

    }
}