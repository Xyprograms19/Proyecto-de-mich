# Etapa 1: build
FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build
WORKDIR /app

# Copia solo el .csproj y restaura dependencias
COPY ExtraHours.API/*.csproj ./ExtraHours.API/
RUN dotnet restore ./ExtraHours.API/*.csproj

# Copia todo el proyecto y compila
COPY . .
RUN dotnet publish ./ExtraHours.API/ExtraHours.API.csproj -c Release -o /out

# Etapa 2: runtime
FROM mcr.microsoft.com/dotnet/aspnet:8.0
WORKDIR /app

# Copiar archivos publicados
COPY --from=build /out .

# Copiar script wait-for-it.sh y darle permisos
COPY ExtraHours.API/wait-for-it.sh .
RUN chmod +x wait-for-it.sh

# Usar script para esperar a MySQL antes de ejecutar la app
ENTRYPOINT ["./wait-for-it.sh", "mysql:3306", "--timeout=90", "--strict", "--", "dotnet", "ExtraHours.API.dll"]
