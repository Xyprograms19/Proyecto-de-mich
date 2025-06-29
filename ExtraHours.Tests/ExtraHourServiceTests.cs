using Xunit;
using Moq;
using System.Threading.Tasks;
using System.Collections.Generic;
using ExtraHours.API.Models;
using ExtraHours.API.Services;

public class ExtraHourServiceTests
{
    [Fact]
    public async Task CreateAsync_Should_Call_Repository_And_Return_ExtraHour()
    {
        // Arrange
        var mockRepo = new Mock<IExtraHourRepository>();
        var extraHour = new ExtraHour { Id = 1, Reason = "Prueba", Status = "Pendiente" };
        mockRepo.Setup(repo => repo.CreateAsync(extraHour)).ReturnsAsync(extraHour);

        var service = new ExtraHourService(mockRepo.Object);

        // Act
        var result = await service.CreateAsync(extraHour);

        // Assert
        Assert.Equal(extraHour, result);
        mockRepo.Verify(repo => repo.CreateAsync(extraHour), Times.Once);
    }
    [Fact]
    public async Task GetAllAsync_Should_Return_All_ExtraHours()
    {
        // Arrange
        var mockRepo = new Mock<IExtraHourRepository>();
        var extraHoursList = new List<ExtraHour>
        {
            new ExtraHour { Id = 1, Reason = "Prueba 1", Status = "Pendiente" },
            new ExtraHour { Id = 2, Reason = "Prueba 2", Status = "Aprobado" }
        };
        mockRepo.Setup(repo => repo.GetAllAsync()).ReturnsAsync(extraHoursList);

        var service = new ExtraHourService(mockRepo.Object);

        // Act
        var result = await service.GetAllAsync();

        // Assert
        Assert.Equal(2, ((List<ExtraHour>)result).Count);
        // Assert.Contains(result, x => x.Reason == "Prueba 1");
        // Assert.Contains(result, x => x.Reason == "Prueba 2");
        mockRepo.Verify(repo => repo.GetAllAsync(), Times.Once);
    }
    [Fact]
    public async Task GetByIdAsync_Should_Return_ExtraHour_When_Found()
    {
        var mockRepo = new Mock<IExtraHourRepository>();
        var extraHour = new ExtraHour { Id = 1, Reason = "Prueba", Status = "Pendiente" };
        mockRepo.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(extraHour);

        var service = new ExtraHourService(mockRepo.Object);

        var result = await service.GetByIdAsync(1);

        Assert.Equal(1, result.Id);
        mockRepo.Verify(repo => repo.GetByIdAsync(1), Times.Once);
    }
    [Fact]
    public async Task UpdateAsync_Should_Return_Updated_ExtraHour_When_Found()
    {
        var mockRepo = new Mock<IExtraHourRepository>();
        var updatedHour = new ExtraHour { Id = 1, Reason = "Actualizar", Status = "Aprobado" };
        mockRepo.Setup(repo => repo.UpdateAsync(1, updatedHour)).ReturnsAsync(updatedHour);

        var service = new ExtraHourService(mockRepo.Object);

        var result = await service.UpdateAsync(1, updatedHour);

        Assert.Equal("Actualizar", result.Reason);

        mockRepo.Verify(repo => repo.UpdateAsync(1, updatedHour), Times.Once);
    }

    [Fact]
    public async Task DeleteAsync_Should_Return_True_When_Deleted()
    {
        var mockRepo = new Mock<IExtraHourRepository>();
        mockRepo.Setup(repo => repo.DeleteAsync(1)).ReturnsAsync(true);

        var service = new ExtraHourService(mockRepo.Object);

        var result = await service.DeleteAsync(1);

        Assert.True(result);
        mockRepo.Verify(repo => repo.DeleteAsync(1), Times.Once);
    }

}