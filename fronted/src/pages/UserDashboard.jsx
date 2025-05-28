import React from "react";
import { useUser } from "../contexts/UserContext";
import { Link } from "react-router-dom";

const UserDashboard = () => {
  const { user, loadingUser, logout } = useUser();

  if (loadingUser) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100">
        Cargando...
      </div>
    );
  }

  if (!user) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gray-100 text-red-500">
        Acceso denegado.
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white p-8 rounded-lg shadow-md text-center">
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Bienvenido, {user.firstName || user.username}!
        </h1>
        <p className="text-gray-600 mb-6">
          Tu rol es:{" "}
          <span className="font-semibold text-blue-600">{user.role}</span>.
        </p>

        <p className="text-gray-700 mb-8">
          Desde aquí puedes gestionar tus horas extras.
        </p>

        <Link
          to="/user-page"
          className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out transform hover:scale-105"
        >
          Ir a Registrar Horas Extras
        </Link>

        <button
          onClick={logout}
          className="mt-6 text-red-500 hover:text-red-700 transition duration-300 ease-in-out block mx-auto"
        >
          Cerrar Sesión
        </button>
      </div>
    </div>
  );
};

export default UserDashboard;
