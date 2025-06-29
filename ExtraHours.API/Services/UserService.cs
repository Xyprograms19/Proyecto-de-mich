using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using Microsoft.EntityFrameworkCore;
using System.Collections.Generic;
using System.Threading.Tasks;
using System;

public class UserService : IUserService
{
    private readonly AppDbContext _context;

    public UserService(AppDbContext context)
    {
        _context = context;
    }

    public async Task<IEnumerable<UserDto>> GetAllAsync()
    {
        return await _context.Users
            .Select(u => new UserDto(u))
            .ToListAsync();
    }

    public async Task<UserDto?> GetByIdAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        return user != null ? new UserDto(user) : null;
    }

    public async Task<UserDto?> CreateAsync(UserCreationDto userDto)
    {
        if (await _context.Users.AnyAsync(u => u.Username == userDto.Username || u.Email == userDto.Email))
            return null;

        string passwordHash = BCrypt.Net.BCrypt.HashPassword(userDto.Password);

        var user = new User
        {
            Username = userDto.Username,
            Email = userDto.Email,
            PasswordHash = passwordHash,
            FirstName = userDto.FirstName,
            LastName = userDto.LastName,
            Role = userDto.Role,
            Department = userDto.Department,
            Position = userDto.Position,
            IsActive = userDto.IsActive,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow
        };

        _context.Users.Add(user);
        await _context.SaveChangesAsync();

        return new UserDto(user);
    }

    public async Task<bool> UpdateAsync(int id, UserUpdateDto userDto)
    {
        var existingUser = await _context.Users.FindAsync(id);
        if (existingUser == null)
            return false;

        if (userDto.Email != null && await _context.Users.AnyAsync(u => u.Email == userDto.Email && u.Id != id))
            return false;
        if (userDto.Username != null && await _context.Users.AnyAsync(u => u.Username == userDto.Username && u.Id != id))
            return false;

        existingUser.Username = userDto.Username ?? existingUser.Username;
        existingUser.Email = userDto.Email ?? existingUser.Email;
        existingUser.FirstName = userDto.FirstName ?? existingUser.FirstName;
        existingUser.LastName = userDto.LastName ?? existingUser.LastName;
        existingUser.Role = userDto.Role ?? existingUser.Role;
        existingUser.Department = userDto.Department ?? existingUser.Department;
        existingUser.Position = userDto.Position ?? existingUser.Position;
        existingUser.IsActive = userDto.IsActive ?? existingUser.IsActive;
        existingUser.ProfilePictureUrl = userDto.ProfilePictureUrl ?? existingUser.ProfilePictureUrl;
        existingUser.UpdatedAt = DateTime.UtcNow;

        _context.Entry(existingUser).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return true;
    }

    public async Task<bool> DeleteAsync(int id)
    {
        var user = await _context.Users.FindAsync(id);
        if (user == null)
            return false;

        _context.Users.Remove(user);
        await _context.SaveChangesAsync();
        return true;
    }
}