# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /src

# Copia primero los archivos de proyecto
COPY ExtraHours.API/*.csproj ./ExtraHours.API/

# Restaurar dependencias
RUN dotnet restore ./ExtraHours.API/ExtraHours.API.csproj

# Luego copia el resto
COPY . .

# Publicar la aplicación
RUN dotnet publish ./ExtraHours.API/ExtraHours.API.csproj -c Release -o /app/publish

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0 AS runtime
WORKDIR /app
COPY --from=build /app/publish .
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
