using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using System.Collections.Generic;
using System.Threading.Tasks;

public interface IUserService
{
    Task<IEnumerable<UserDto>> GetAllAsync();
    Task<UserDto?> GetByIdAsync(int id);
    Task<UserDto?> CreateAsync(UserCreationDto userDto);
    Task<bool> UpdateAsync(int id, UserUpdateDto userDto);
    Task<bool> DeleteAsync(int id);
}