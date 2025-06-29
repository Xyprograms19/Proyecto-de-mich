using Xunit;
using Moq;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Configuration;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using ExtraHours.API.Services;
using System.Collections.Generic;
using BCrypt.Net;

public class AuthServiceTests
{
    [Fact]
    public async Task RegisterAsync_Should_Create_New_User_When_Data_Is_Valid()
    {
        // Arrange
        var options = new DbContextOptionsBuilder<AppDbContext>()
            .UseInMemoryDatabase(databaseName: "RegisterTestDb")
            .Options;

        var configMock = new Mock<IConfiguration>();

        using (var context = new AppDbContext(options))
        {
            var authService = new AuthService(context, configMock.Object);

            var registerRequest = new RegisterRequest
            {
                Username = "Grupo4",
                Email = "grupo4@ejemplo.com",
                Password = "1234",
                FirstName = "grupo",
                LastName = "4",
                Department = "TI",
                Position = "Desarrolladores"
            };
            // Act
            var user = await authService.RegisterAsync(registerRequest);

            // Assert
            Assert.NotNull(user);
            // Assert.Equal(registerRequest.Username, user.Username);
            // Assert.Equal(registerRequest.Email, user.Email);
            Assert.True(BCrypt.Net.BCrypt.Verify(registerRequest.Password, user.PasswordHash));
        }
    }
}