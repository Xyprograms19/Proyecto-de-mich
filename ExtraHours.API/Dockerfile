# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src

# Copiar archivo .csproj primero (ajustado al nombre correcto y ruta)
COPY ExtraHours.API.csproj ./

# Restaurar dependencias
RUN dotnet restore

# Copiar el resto de archivos del proyecto
COPY . .

# Publicar la app
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app
COPY --from=build /app/publish .

EXPOSE 5023
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
