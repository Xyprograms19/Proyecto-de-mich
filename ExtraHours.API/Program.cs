using Microsoft.EntityFrameworkCore;
using ExtraHours.API.Data;
using ExtraHours.API.Models;
using Microsoft.AspNetCore.Authentication.JwtBearer;
using Microsoft.IdentityModel.Tokens;
using System.Text;
using Microsoft.OpenApi.Models;
using System.Security.Claims;
using Microsoft.AspNetCore.Builder;
using Microsoft.Extensions.DependencyInjection;
using Microsoft.Extensions.Configuration;
using System.Text.Json.Serialization;
using Microsoft.AspNetCore.Identity;
using BCrypt.Net;
using ExtraHours.API.Services;
using ExtraHours.API.Repositories;

var builder = WebApplication.CreateBuilder(args);

// Servicios
builder.Services.AddScoped<IExtraHourService, ExtraHourService>();
builder.Services.AddScoped<IDepartmentService, DepartmentService>();
builder.Services.AddScoped<IAuthService, AuthService>();
builder.Services.AddScoped<IExtraHourRequestService, ExtraHourRequestService>();
builder.Services.AddScoped<IUserService, UserService>();
builder.Services.AddScoped<IExtraHourRepository, ExtraHourRepository>();
builder.Services.AddScoped<IDepartmentRepository, DepartmentRepository>();
builder.Services.AddScoped<IExtraHourRequestRepository, ExtraHourRequestRepository>();

// Conexión a base de datos
var connectionString = builder.Configuration.GetConnectionString("DefaultConnection");
builder.Services.AddDbContext<AppDbContext>(options =>
    options.UseMySql(connectionString, ServerVersion.AutoDetect(connectionString)));

// CORS - 🚨 Aquí se corrige la URL del frontend
builder.Services.AddCors(options =>
{
    options.AddPolicy("AllowSpecificOrigin",
        policy =>
        {
            policy.WithOrigins("http://localhost:5173") // ⚠️ ESTE es el puerto correcto para React
                  .AllowAnyHeader()
                  .AllowAnyMethod()
                  .AllowCredentials();
        });
});

// Controladores
builder.Services.AddControllers()
    .AddJsonOptions(options =>
    {
        options.JsonSerializerOptions.Converters.Add(new JsonStringEnumConverter());
    });

builder.Services.AddEndpointsApiExplorer();

// Swagger
builder.Services.AddSwaggerGen(options =>
{
    options.SwaggerDoc("v1", new OpenApiInfo { Title = "ExtraHours API", Version = "v1" });

    options.AddSecurityDefinition("Bearer", new OpenApiSecurityScheme
    {
        Description = "Token JWT en formato Bearer",
        Name = "Authorization",
        In = ParameterLocation.Header,
        Type = SecuritySchemeType.ApiKey,
        Scheme = "Bearer"
    });

    options.AddSecurityRequirement(new OpenApiSecurityRequirement
    {
        {
            new OpenApiSecurityScheme
            {
                Reference = new OpenApiReference
                {
                    Type = ReferenceType.SecurityScheme,
                    Id = "Bearer"
                },
                Scheme = "oauth2",
                Name = "Bearer",
                In = ParameterLocation.Header
            },
            new List<string>()
        }
    });
});

// Autenticación y autorización
builder.Services.AddAuthentication(JwtBearerDefaults.AuthenticationScheme)
    .AddJwtBearer(options =>
    {
        options.TokenValidationParameters = new TokenValidationParameters
        {
            ValidateIssuer = true,
            ValidateAudience = true,
            ValidateLifetime = true,
            ValidateIssuerSigningKey = true,
            ValidIssuer = builder.Configuration["Jwt:Issuer"],
            ValidAudience = builder.Configuration["Jwt:Audience"],
            IssuerSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(builder.Configuration["Jwt:Key"]))
        };
    });

builder.Services.AddAuthorization(options =>
{
    options.AddPolicy("AdminOnly", policy => policy.RequireRole(UserRole.Admin.ToString()));
    options.AddPolicy("ManagerOrAdmin", policy => policy.RequireRole(UserRole.Manager.ToString(), UserRole.Admin.ToString()));
});

var app = builder.Build();

// Semilla de datos
using (var scope = app.Services.CreateScope())
{
    var context = scope.ServiceProvider.GetRequiredService<AppDbContext>();

    // Aplica migraciones automáticamente si no están aplicadas
    context.Database.Migrate();

    // Semilla de datos
    if (!context.Departments.Any(d => d.Name == "Administración"))
    {
        context.Departments.Add(new Department { Name = "Administración", Employees = 0, Status = "Activo" });
    }
    if (!context.Departments.Any(d => d.Name == "Ventas"))
    {
        context.Departments.Add(new Department { Name = "Ventas", Employees = 0, Status = "Activo" });
    }

    if (!context.Users.Any(u => u.Email == "admin@ejemplo.com"))
    {
        var usuarioBase = new User
        {
            Username = "admin",
            Email = "admin@ejemplo.com",
            FirstName = "Administrador",
            LastName = "Principal",
            Role = UserRole.Admin,
            Department = "Administración",
            Position = "Administrador General",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("admin123")
        };
        context.Users.Add(usuarioBase);
    }

    if (!context.Users.Any(u => u.Email == "empleado1@ejemplo.com"))
    {
        var empleado = new User
        {
            Username = "empleado1",
            Email = "empleado1@ejemplo.com",
            FirstName = "Vero",
            LastName = "Morante",
            Role = UserRole.Employee,
            Department = "Ventas",
            Position = "Vendedora",
            IsActive = true,
            CreatedAt = DateTime.UtcNow,
            UpdatedAt = DateTime.UtcNow,
            PasswordHash = BCrypt.Net.BCrypt.HashPassword("empleado123")
        };
        context.Users.Add(empleado);
    }

    context.SaveChanges();
}

// Middleware
app.UseSwagger();
app.UseSwaggerUI(options =>
{
    options.SwaggerEndpoint("/swagger/v1/swagger.json", "ExtraHours API v1");
    options.RoutePrefix = string.Empty;
});

app.UseHttpsRedirection();

app.UseCors("AllowSpecificOrigin");

app.UseAuthentication();
app.UseAuthorization();

app.MapControllers();
app.Run();
