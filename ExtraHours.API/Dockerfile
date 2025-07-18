# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copiar archivos del proyecto
COPY ExtraHours.API.csproj ./

# Restaurar dependencias
RUN dotnet restore

# Copiar todo el código (debe incluir Program.cs, etc.)
COPY . .

# Publicar la app en modo Release
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app

# Copiar la app publicada
COPY --from=build /app/publish .

# Exponer el puerto (ajusta si usas otro)
EXPOSE 5023

# Ejecutar la app
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
