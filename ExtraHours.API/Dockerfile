# ===========================
# Etapa 1: Build
# ===========================
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copiar archivo de proyecto
COPY ExtraHours.API.csproj ./

# Restaurar dependencias
RUN dotnet restore

# Copiar todos los archivos restantes del proyecto
COPY . ./

# Publicar la aplicación en modo Release
RUN dotnet publish -c Release -o /app/publish

# ===========================
# Etapa 2: Runtime
# ===========================
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app

# Copiar archivos publicados desde la etapa build
COPY --from=build /app/publish .

# Exponer el puerto configurado para la app
EXPOSE 5023

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
