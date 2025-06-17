import React, { useState, useEffect } from "react";

import { FiEdit } from "react-icons/fi";

const Users = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [departmentsList, setDepartmentsList] = useState([]);

  const [currentUser, setCurrentUser] = useState({
    id: null,
    username: "",
    email: "",

    role: "",
    department: "",
    position: "",
    isActive: true,
    password: "",
    firstName: "",
    lastName: "",
    profilePictureUrl: "",
  });

  const fetchUsers = async () => {
    setLoading(true);
    setError(null);
    try {
      const authToken = localStorage.getItem("authToken");

      const headers = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const res = await fetch("http://localhost:5023/api/users", {
        method: "GET",
        headers: headers,
      });

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Error HTTP: ${res.status} ${res.statusText}`;

        try {
          const errorData = JSON.parse(errorText);
          errorMessage = errorData.message || errorData.detail || errorText;
        } catch (jsonError) {
          console.error(jsonError);
          console.warn("La respuesta de error no es JSON:", errorText);
        }
        throw new Error(errorMessage);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const data = await res.json();
        setUsers(data);
      } else {
        console.warn(
          "La respuesta de GET users no es JSON o está vacía.",
          await res.text()
        );
        setUsers([]);
      }
    } catch (err) {
      setError(err.message);
      console.error("Error fetching users:", err);
      if (err.message.includes("401 Unauthorized")) {
        alert(
          "Sesión expirada o no autorizado. Por favor, inicie sesión de nuevo."
        );
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();

    fetch("http://localhost:5023/api/departments")
      .then((res) => res.json())
      .then((data) => setDepartmentsList(data))
      .catch(() => setDepartmentsList([]));
  }, []);

  // useEffect(() => {
  //   fetchUsers();
  // }, []);

  const handleOpenModal = (user = null) => {
    setIsModalOpen(true);
    if (user) {
      setIsEditMode(true);
      setCurrentUser({
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        department: user.department,
        position: user.position || "",
        isActive: user.isActive,
        password: "",
        firstName: user.firstName || "",
        lastName: user.lastName || "",
        profilePictureUrl: user.profilePictureUrl || "",
      });
    } else {
      setIsEditMode(false);
      setCurrentUser({
        id: null,
        username: "",
        email: "",
        role: "",
        department: "",
        position: "",
        isActive: true,
        password: "",
        firstName: "",
        lastName: "",
        profilePictureUrl: "",
      });
    }
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentUser({
      id: null,
      username: "",
      email: "",
      role: "",
      department: "",
      position: "",
      isActive: true,
      password: "",
      firstName: "",
      lastName: "",
      profilePictureUrl: "",
    });
  };

  const handleSaveUser = async () => {
    try {
      let res;
      const authToken = localStorage.getItem("authToken");
      const headers = {
        "Content-Type": "application/json",
      };
      if (authToken) {
        headers["Authorization"] = `Bearer ${authToken}`;
      }

      const userPayload = {
        username: currentUser.username,
        email: currentUser.email,
        firstName: currentUser.firstName,
        lastName: currentUser.lastName,
        role: currentUser.role,
        department: currentUser.department,
        position: currentUser.position,
        isActive: currentUser.isActive,
        profilePictureUrl: currentUser.profilePictureUrl,
      };

      if (isEditMode) {
        userPayload.id = currentUser.id;
        console.log("Payload para PUT:", userPayload);
        res = await fetch(`http://localhost:5023/api/users/${currentUser.id}`, {
          method: "PUT",
          headers: headers,
          body: JSON.stringify(userPayload),
        });
      } else {
        if (
          !userPayload.username ||
          !userPayload.email ||
          !currentUser.password ||
          !userPayload.role
        ) {
          alert(
            "Los campos Usuario, Email, Contraseña y Rol son requeridos para un nuevo usuario."
          );
          return;
        }

        userPayload.password = currentUser.password;

        console.log("Payload para POST:", userPayload);
        res = await fetch("http://localhost:5023/api/users", {
          method: "POST",
          headers: headers,
          body: JSON.stringify(userPayload),
        });
      }

      if (!res.ok) {
        const errorText = await res.text();
        let errorMessage = `Error HTTP: ${res.status} ${res.statusText}`;
        try {
          const errorData = JSON.parse(errorText);
          errorMessage =
            errorData.message ||
            errorData.detail ||
            JSON.stringify(errorData.errors) ||
            errorText;
        } catch (jsonError) {
          console.error(jsonError);
          console.warn("La respuesta de error no es JSON:", errorText);
        }
        throw new Error(errorMessage);
      }

      const contentType = res.headers.get("content-type");
      if (contentType && contentType.includes("application/json")) {
        const savedUserData = await res.json();
        console.log("Usuario guardado/actualizado:", savedUserData);
      } else {
        console.log("Operación exitosa, sin contenido de respuesta JSON.");
      }

      fetchUsers();
      handleCloseModal();
    } catch (err) {
      alert("Error al guardar el usuario: " + err.message);
      console.error("Error saving user:", err);
    }
  };

  if (loading) {
    return (
      <div className="text-center py-8 text-gray-700">Cargando usuarios...</div>
    );
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4 text-gray-900">
      <h1 className="text-3xl font-bold mb-6 text-gray-900">
        Gestión de Usuarios
      </h1>

      <div className="mb-4 flex justify-end">
        <button
          onClick={() => handleOpenModal()}
          className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700 transition-colors shadow-md"
        >
          Crear Nuevo Usuario
        </button>
      </div>

      <div className="bg-white shadow-md rounded-lg overflow-hidden">
        <table className="min-w-full bg-white">
          <thead className="bg-gray-100 border-b border-gray-200">
            <tr>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                ID
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Usuario
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Email
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Rol
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Departamento
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Puesto
              </th>{" "}
              {/* Añadir Puesto a la tabla */}
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Estado
              </th>
              <th className="py-2 px-2 text-left text-sm font-semibold text-gray-600">
                Acciones
              </th>
            </tr>
          </thead>
          <tbody>
            {users.length === 0 ? (
              <tr>
                <td colSpan="8" className="text-center py-4 text-gray-500">
                  No hay usuarios para mostrar.
                </td>
              </tr>
            ) : (
              users.map((user) => (
                <tr key={user.id} className="border-b hover:bg-gray-50">
                  <td className="py-2 px-2 text-gray-800">{user.id}</td>
                  <td className="py-2 px-2 text-gray-800">{user.username}</td>
                  <td className="py-2 px-2 text-gray-800">{user.email}</td>
                  <td className="py-2 px-2 text-gray-800">{user.role}</td>
                  <td className="py-2 px-2 text-gray-800">{user.department}</td>
                  <td className="py-2 px-2 text-gray-800">
                    {user.position}
                  </td>{" "}
                  {/* Mostrar Position */}
                  <td className="py-2 px-2">
                    <span
                      className={
                        user.isActive
                          ? "px-2 py-1 rounded-full text-xs bg-green-100 text-green-800"
                          : "px-2 py-1 rounded-full text-xs bg-red-100 text-red-800"
                      }
                    >
                      {user.isActive ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="py-2 px-2 flex justify-start space-x-2">
                    <button
                      onClick={() => handleOpenModal(user)}
                      className="text-blue-600 hover:text-blue-800 p-1 rounded hover:bg-blue-100 transition-colors"
                      title="Editar"
                    >
                      {/* Descomenta y usa tus iconos si los tienes importados */}
                      <FiEdit size={20} /> Editar
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-lg mx-4 sm:mx-auto text-gray-900">
            <h2 className="text-2xl font-bold mb-4">
              {isEditMode ? "Editar Usuario" : "Nuevo Usuario"}
            </h2>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                Nombre de Usuario
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.username}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, username: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.email}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, email: e.target.value })
                }
              />
            </div>
            {/* Campos FirstName y LastName */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Nombre</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.firstName}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, firstName: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Apellido</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.lastName}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, lastName: e.target.value })
                }
              />
            </div>

            {!isEditMode && (
              <div className="mb-4">
                <label className="block text-gray-700 mb-1">Contraseña</label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                  value={currentUser.password}
                  onChange={(e) =>
                    setCurrentUser({ ...currentUser, password: e.target.value })
                  }
                />
              </div>
            )}
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Rol</label>
              <select
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.role}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, role: e.target.value })
                }
              >
                <option value="">Selecciona un rol</option> {}
                <option value="Admin">Admin</option>
                <option value="Manager">Manager</option>
                <option value="Employee">Employee</option>
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Departamento</label>
              <select
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.department}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, department: e.target.value })
                }
              >
                <option value="">Selecciona un departamento</option>
                {departmentsList.map((dep) => (
                  <option key={dep.id} value={dep.name}>
                    {dep.name}
                  </option>
                ))}
              </select>
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Puesto</label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.position}
                onChange={(e) =>
                  setCurrentUser({ ...currentUser, position: e.target.value })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">
                URL Imagen de Perfil (opcional)
              </label>
              <input
                type="text"
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.profilePictureUrl}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    profilePictureUrl: e.target.value,
                  })
                }
              />
            </div>
            <div className="mb-4">
              <label className="block text-gray-700 mb-1">Estado</label>
              <select
                className="w-full px-3 py-2 border rounded bg-white text-gray-900"
                value={currentUser.isActive}
                onChange={(e) =>
                  setCurrentUser({
                    ...currentUser,
                    isActive: e.target.value === "true",
                  })
                }
              >
                <option value="true">Activo</option>
                <option value="false">Inactivo</option>
              </select>
            </div>
            <div className="flex justify-end">
              <button
                onClick={handleCloseModal}
                className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 mr-2 transition-colors"
              >
                Cancelar
              </button>
              <button
                onClick={handleSaveUser}
                className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
              >
                {isEditMode ? "Guardar Cambios" : "Crear Usuario"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;
