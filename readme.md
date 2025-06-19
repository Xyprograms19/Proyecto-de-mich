# ExtraHours.API

API para la gestión de horas extra. Incluye autenticación JWT, roles de usuario (Admin, Employee, Manager), endpoints para usuarios y solicitudes de horas extra, y un frontend en React.

#### Grupo 4

---

## Requisitos

- [.NET 9 SDK](https://dotnet.microsoft.com/download)
- [Node.js y npm](https://nodejs.org/) (solo para el frontend)
- [MySQL](https://www.mysql.com/)

---

## Instalación y primer uso

### 1. Clona el repositorio

```bash
git clone https://github.com/Vero-nica22/backendgrupo4.git
cd ExtraHours.API
```

### 2. Restaura las dependencias del backend

```bash
dotnet restore
```

### 3. Aplica las migraciones y crea la base de datos

```bash
dotnet ef database update
```

> Si no tienes instalado el CLI de EF Core:
>
> ```bash
> dotnet tool install --global dotnet-ef
> ```

### 4. Corre el backend

```bash
dotnet run
```

El backend estará disponible en `https://localhost:5023`.

---

## Usuarios base

Al iniciar el proyecto, se crean automáticamente estos usuarios:

| Rol      | Usuario               | Contraseña  |
| -------- | --------------------- | ----------- |
| Admin    | admin@ejemplo.com     | admin123    |
| Employee | empleado1@ejemplo.com | empleado123 |

Puedes usarlos para probar el login y los endpoints protegidos.

---

## Endpoints principales

- **Login:**  
  `POST /api/auth/login`

  ```json
  {
    "usernameOrEmail": "admin@ejemplo.com",
    "password": "admin123"
  }
  ```

- **Registro:**  
  `POST /api/auth/register`

- **Usuarios:**  
  `GET /api/users`  
  `POST /api/users`  
  (requiere autenticación)

- **Solicitudes de horas extra:**  
  `GET /api/extrahours`  
  `POST /api/extrahours`  
  (requiere autenticación)

---

## Frontend

Correr el fronted:

```bash
cd fronted
npm install
npm run dev
```

El frontend estará disponible en `http://localhost:5173`.

- **Login:**  
  `http://localhost:5173/login`
  Ingresar con segun rol:

| Rol      | Usuario               | Contraseña  |
| -------- | --------------------- | ----------- |
| Admin    | admin@ejemplo.com     | admin123    |
| Employee | empleado1@ejemplo.com | empleado123 |

---

## Notas

- Cambia las cadenas de conexión y claves JWT en `appsettings.json` según tu entorno.
- Los usuarios base se crean solo si no existen en la base de datos.
- Las contraseñas se almacenan con hash seguro (BCrypt).

---

## Muchas gracias
