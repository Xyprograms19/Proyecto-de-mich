using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using System;
using System.Threading.Tasks;
using System.IdentityModel.Tokens.Jwt;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using System.Security.Claims;

namespace ExtraHours.API.Services;

public class AuthService : IAuthService
{
    private readonly AppDbContext _context;
    private readonly IConfiguration _configuration;

    public AuthService(AppDbContext context, IConfiguration configuration)
    {
        _context = context;
        _configuration = configuration;
    }

    public async Task<User?> RegisterAsync(RegisterRequest request)
    {
        if (await _context.Users.AnyAsync(u => u.Username == request.Username || u.Email == request.Email))
            return null;

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(request.Password);

        var user = new User
        {
            Username = request.Username,
            Email = request.Email,
            PasswordHash = passwordHash,
            FirstName = request.FirstName,
            LastName = request.LastName,
            Role = UserRole.Employee,
            Department = "General",
            Position = "N/A",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();
        return user;
    }

    public async Task<(string token, User? user)> LoginAsync(LoginRequest request, bool rememberMe)
    {
        var user = await _context.Users
            .FirstOrDefaultAsync(u => u.Username == request.UsernameOrEmail || u.Email == request.UsernameOrEmail);

        if (user == null || !BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
            return (null, null);

        TimeSpan expiryDuration = rememberMe ? TimeSpan.FromDays(7) : TimeSpan.FromHours(1);

        var tokenHandler = new JwtSecurityTokenHandler();
        var key = Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]);
        var claims = new[]
        {
            new Claim(ClaimTypes.NameIdentifier, user.Id.ToString()),
            new Claim(ClaimTypes.Name, user.Username),
            new Claim(ClaimTypes.Email, user.Email),
            new Claim(ClaimTypes.Role, user.Role.ToString())
        };

        var tokenDescriptor = new SecurityTokenDescriptor
        {
            Subject = new ClaimsIdentity(claims),
            Expires = DateTime.UtcNow.Add(expiryDuration),
            Issuer = _configuration["Jwt:Issuer"],
            Audience = _configuration["Jwt:Audience"],
            SigningCredentials = new SigningCredentials(new SymmetricSecurityKey(key), SecurityAlgorithms.HmacSha256Signature)
        };

        var token = tokenHandler.CreateToken(tokenDescriptor);
        var tokenString = tokenHandler.WriteToken(token);

        return (tokenString, user);
    }
}

// using ExtraHours.API.Models;
// using ExtraHours.API.DTOs;
// using ExtraHours.API.Repositories;
// using Microsoft.Extensions.Configuration;
// using System;
// using System.Threading.Tasks;
// using System.IdentityModel.Tokens.Jwt;
// using Microsoft.IdentityModel.Tokens;
// using System.Text;
// using System.Security.Claims;

// namespace ExtraHours.API.Services;

// public class AuthService : IAuthService
// {
//     private readonly IUserRepository _userRepository;
//     private readonly IConfiguration _configuration;

//     public AuthService(IUserRepository userRepository, IConfiguration configuration)
//     {
//         _userRepository = userRepository;
//         _configuration = configuration;
//     }

//     public async Task<User?> RegisterAsync(RegisterRequest request)
//     {
//         if (await _userRepository.ExistsByUsernameOrEmailAsync(request.Username, request.Email))
//             return null;

//         var user = new User
//         {
//             Username = request.Username,
//             Email = request.Email,
//             PasswordHash = BCrypt.Net.BCrypt.HashPassword(request.Password),
//             FirstName = request.FirstName,
//             LastName = request.LastName,
//             Department = request.Department,
//             Position = request.Position,
//             Role = UserRole.Employee,
//             IsActive = true
//         };

//         return await _userRepository.AddAsync(user);
//     }

//     public async Task<(string token, User? user)> LoginAsync(LoginRequest request, bool isAdmin)
//     {
//         var user = await _userRepository.GetByUsernameOrEmailAsync(request.UsernameOrEmail);

//         if (user == null || !user.IsActive)
//             return (null!, null);

//         if (!BCrypt.Net.BCrypt.Verify(request.Password, user.PasswordHash))
//             return (null!, null);

//         if (isAdmin && user.Role != UserRole.Admin)
//             return (null!, null);

//         var token = GenerateJwtToken(user);
//         return (token, user);
//     }

//     private string GenerateJwtToken(User user)
//     {
//         var key = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["Jwt:Key"]!));
//         var creds = new SigningCredentials(key, SecurityAlgorithms.HmacSha256);

//         var claims = new[]
//         {
//             new Claim(JwtRegisteredClaimNames.Sub, user.Username),
//             new Claim("role", user.Role.ToString()),
//             new Claim(JwtRegisteredClaimNames.Email, user.Email),
//             new Claim("userId", user.Id.ToString())
//         };

//         var token = new JwtSecurityToken(
//             issuer: _configuration["Jwt:Issuer"],
//             audience: _configuration["Jwt:Audience"],
//             claims: claims,
//             expires: DateTime.UtcNow.AddHours(8),
//             signingCredentials: creds
//         );

//         return new JwtSecurityTokenHandler().WriteToken(token);
//     }
// }