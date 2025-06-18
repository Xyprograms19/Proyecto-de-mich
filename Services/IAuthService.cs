using ExtraHours.API.DTOs;
using ExtraHours.API.Models;
using System.Threading.Tasks;

public interface IAuthService
{
    Task<User?> RegisterAsync(RegisterRequest request);
    Task<(string token, User? user)> LoginAsync(LoginRequest request, bool rememberMe);
}