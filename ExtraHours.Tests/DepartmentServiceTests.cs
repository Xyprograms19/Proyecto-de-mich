using Xunit;
using Moq;
using System.Collections.Generic;
using System.Threading.Tasks;
using ExtraHours.API.Models;
using ExtraHours.API.Services;
using ExtraHours.API.Repositories;

public class DepartmentServiceTests
{
    [Fact]
    public async Task GetAllAsync_Should_Return_All_Departments()
    {
        // Arrange
        var mockRepo = new Mock<IDepartmentRepository>();
        var departments = new List<Department>
        {
            new Department { Id = 1, Name = "Ventas", Status = "Activo" },
            new Department { Id = 2, Name = "Recursos Humanos", Status = "Activo" }
        };
        mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(departments);

        var service = new DepartmentService(mockRepo.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.Equal(2, ((List<Department>)result).Count);
        // Assert.Contains(result, d => d.Name == "TI");
        // Assert.Contains(result, d => d.Name == "Recursos Humanos");
        mockRepo.Verify(repo => repo.GetAllAsync(), Times.Once);
    }
    [Fact]
    public async Task GetByIdAsync_Should_Return_Department_When_Found()
    {
        var mockRepo = new Mock<IDepartmentRepository>();
        var department = new Department { Id = 1, Name = "Ventas", Status = "Activo" };
        mockRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(department);

        var service = new DepartmentService(mockRepo.Object);

        var result = await service.GetByIdAsync(1);

        Assert.Equal(1, result.Id);
        mockRepo.Verify(repo => repo.GetByIdAsync(1), Times.Once);
    }
    [Fact]
    public async Task CreateAsync_Should_Return_Created_Department()
    {
        var mockRepo = new Mock<IDepartmentRepository>();
        var department = new Department { Id = 1, Name = "Ventas", Status = "Activo" };
        mockRepo.Setup(repo => repo.CreateAsync(department)).ReturnsAsync(department);

        var service = new DepartmentService(mockRepo.Object);

        var result = await service.CreateAsync(department);

        Assert.NotNull(result);
        mockRepo.Verify(repo => repo.CreateAsync(department), Times.Once);
    }

    [Fact]
    public async Task UpdateAsync_Should_Return_Updated_Department_When_Found()
    {
        var mockRepo = new Mock<IDepartmentRepository>();
        var updated = new Department { Id = 1, Name = "Actualizar", Status = "Activo" };
        mockRepo.Setup(r => r.UpdateAsync(1, updated)).ReturnsAsync(updated);

        var service = new DepartmentService(mockRepo.Object);

        var result = await service.UpdateAsync(1, updated);

        Assert.Equal("Actualizar", result.Name);
        mockRepo.Verify(r => r.UpdateAsync(1, updated), Times.Once);
    }
    [Fact]
    public async Task DeleteAsync_Should_Return_True_When_Deleted()
    {
        var mockRepo = new Mock<IDepartmentRepository>();
        mockRepo.Setup(repo => repo.DeleteAsync(1)).ReturnsAsync(true);

        var service = new DepartmentService(mockRepo.Object);

        var result = await service.DeleteAsync(1);

        Assert.True(result);
        mockRepo.Verify(repo => repo.DeleteAsync(1), Times.Once);
    }



}