# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /src

# Copiar el .csproj y restaurar dependencias
COPY ExtraHours.API.csproj ./
RUN dotnet restore

# Copiar el resto de archivos del proyecto
COPY . . 

# Publicar la aplicación
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app

# Copiar la app publicada desde la etapa anterior
COPY --from=build /app/publish .

# Exponer el puerto (ajusta si usas otro en launchSettings.json)
EXPOSE 5023

# Ejecutar la app
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
