using Xunit;
using Moq;
using System.Threading.Tasks;
using ExtraHours.API.Models;
using ExtraHours.API.DTOs;
using ExtraHours.API.Services;
using ExtraHours.API.Repositories;
using System;

public class ExtraHourRequestServiceTests
{
    [Fact]
    public async Task CreateAsync_Should_Create_New_ExtraHourRequest()
    {
        // Arrange
        var repoMock = new Mock<IExtraHourRequestRepository>();
        var userId = 1;
        var requestDto = new ExtraHourRequestCreateDto
        {
            DateOfExtraHours = DateTime.Today,
            StartTime = DateTime.Today.AddHours(19),
            EndTime = DateTime.Today.AddHours(20),
            Reason = "Prueba"
        };

        repoMock.Setup(repo => repo.CreateAsync(It.IsAny<ExtraHourRequest>()))
            .ReturnsAsync((ExtraHourRequest req) => req);

        var service = new ExtraHourRequestService(repoMock.Object);

        // Act
        var result = await service.CreateAsync(userId, requestDto);

        // Assert
        Assert.NotNull(result);
        // Assert.Equal(userId, result.UserId);
        // Assert.Equal(requestDto.Reason, result.Reason);
        // Assert.Equal("Pendiente", result.Status);
        repoMock.Verify(repo => repo.CreateAsync(It.IsAny<ExtraHourRequest>()), Times.Once);
    }
    [Fact]
    public async Task GetByIdAsync_Should_Return_ExtraHourRequest_When_Found()
    {
        var repoMock = new Mock<IExtraHourRequestRepository>();
        var request = new ExtraHourRequest { Id = 1, Reason = "Prueba", Status = "Pendiente" };
        repoMock.Setup(repo => repo.GetByIdAsync(1)).ReturnsAsync(request);

        var service = new ExtraHourRequestService(repoMock.Object);

        var result = await service.GetByIdAsync(1);

        Assert.Equal(1, result.Id);
        repoMock.Verify(repo => repo.GetByIdAsync(1), Times.Once);
    }
    [Fact]
    public async Task GetAllAsync_Should_Return_All_ExtraHourRequests()
    {
        var repoMock = new Mock<IExtraHourRequestRepository>();
        var requests = new List<ExtraHourRequest>
        {
            new ExtraHourRequest { Id = 1, Reason = "Prueba 1", Status = "Pendiente" },
            new ExtraHourRequest { Id = 2, Reason = "Prueba 2", Status = "Aprobado" }
        };
        repoMock.Setup(repo => repo.GetAllAsync()).ReturnsAsync(requests);

        var service = new ExtraHourRequestService(repoMock.Object);

        var result = await service.GetAllAsync();

        Assert.Equal(2, ((List<ExtraHourRequest>)result).Count);
        repoMock.Verify(repo => repo.GetAllAsync(), Times.Once);
    }


}