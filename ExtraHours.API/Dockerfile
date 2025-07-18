# Etapa 1: Build
FROM mcr.microsoft.com/dotnet/sdk:9.0-preview AS build
WORKDIR /app

# Copiar solo el archivo .csproj (ya estamos dentro de ExtraHours.API)
COPY ./ExtraHours.API.csproj ./

# Restaurar dependencias
RUN dotnet restore 

# Copiar el resto de archivos del proyecto
COPY . . 

# Publicar la aplicación
RUN dotnet publish -c Release -o /app/publish

# Etapa 2: Runtime
FROM mcr.microsoft.com/dotnet/aspnet:9.0-preview AS runtime
WORKDIR /app

# Copiar lo publicado desde el build
COPY --from=build /app/publish .

# Exponer el puerto (ajústalo si usas otro)
EXPOSE 5023

# Ejecutar la aplicación
ENTRYPOINT ["dotnet", "ExtraHours.API.dll"]
