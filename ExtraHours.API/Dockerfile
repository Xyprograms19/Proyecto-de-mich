# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copiar el archivo .csproj y restaurar dependencias
COPY ExtraHours.API.csproj ./
RUN dotnet restore

# Copiar el resto de archivos
COPY . .

# Publicar la aplicación
RUN dotnet publish -c Release -o /out

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app
COPY --from=build /out .

# Puerto que usa la app (mismo que en launchSettings.json o el expuesto en compose)
EXPOSE 5023

ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
