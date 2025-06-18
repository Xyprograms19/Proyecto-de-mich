import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import userService from "../services/userService";
import departmentService from "../services/departmentService";
import extraHourRequestService from "../services/extraHourRequestService";

const Overview = () => {
  const [users, setUsers] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [recentRequests, setRecentRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      setError(null);
      try {
        const usersRes = await userService.getAllUsers();
        setUsers(usersRes.data);

        const departmentsRes = await departmentService.getDepartments();
        setDepartments(departmentsRes.data);

        const requestsRes =
          await extraHourRequestService.getRecentExtraHourRequests(5);
        setRecentRequests(requestsRes.data);
      } catch (err) {
        console.error(err);
        setError("Error al cargar los datos del resumen.");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Estadísticas
  const totalUsers = users.length;
  const activeUsersCount = users.filter((u) => u.isActive).length;
  const pendingExtraHoursCount = recentRequests.filter(
    (r) => r.status === "Pendiente"
  ).length;

  const departmentStats = departments.map((dep) => {
    const employees = users.filter((u) => u.department === dep.name).length;
    const totalExtraHours = recentRequests
      .filter((r) => r.department === dep.name)
      .reduce((sum, r) => sum + (r.hours || 0), 0);
    return {
      department: dep.name,
      employees,
      totalExtraHours,
    };
  });

  const cardBg = "bg-white";
  const textColor = "text-gray-900";
  const subtextColor = "text-gray-500";

  return (
    <div className="space-y-4 p-4 sm:p-6">
      {error && (
        <div
          className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
          role="alert"
        >
          <strong className="font-bold">¡Error!</strong>
          <span className="block sm:inline"> {error}</span>
          <button
            className="absolute top-0 bottom-0 right-0 px-4 py-3"
            onClick={() => setError(null)}
          >
            <svg
              className="fill-current h-6 w-6 text-red-500"
              role="button"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
            >
              <title>Close</title>
              <path d="M14.348 14.849a1.2 1.2 0 0 1-1.697 0L10 11.197l-2.651 3.652a1.2 1.2 0 1 1-1.697-1.697L8.303 10l-3.652-2.651a1.2 1.2 0 0 1 1.697-1.697L10 8.803l2.651-3.652a1.2 1.2 0 0 1 1.697 1.697L11.697 10l3.652 2.651a1.2 1.2 0 0 1 0 1.698z" />
            </svg>
          </button>
        </div>
      )}

      {loading ? (
        <div className="text-center py-8 text-gray-600">
          Cargando datos del resumen...
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-6">
            <Card className={cardBg}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${subtextColor}`}>
                  Total Usuarios
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {totalUsers}
                </div>
                <p className="text-xs text-green-500 flex items-center mt-1">
                  <span>{activeUsersCount} activos</span>
                </p>
              </CardContent>
            </Card>
            <Card className={cardBg}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${subtextColor}`}>
                  Horas Extra Pendientes
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {pendingExtraHoursCount}
                </div>
                <p className="text-xs text-yellow-500 flex items-center mt-1"></p>
              </CardContent>
            </Card>
            <Card className={cardBg}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${subtextColor}`}>
                  Horas Aprobadas (Mes)
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {recentRequests
                    .filter(
                      (r) =>
                        r.status === "Aprobado" &&
                        new Date(r.dateOfExtraHours || r.date).getMonth() ===
                          new Date().getMonth() &&
                        new Date(r.dateOfExtraHours || r.date).getFullYear() ===
                          new Date().getFullYear()
                    )
                    .reduce((sum, r) => sum + (r.hours || 0), 0)}
                </div>
                <p className="text-xs text-blue-500 flex items-center mt-1">
                  <span>Horas aprobadas este mes</span>
                </p>
              </CardContent>
            </Card>

            <Card className={cardBg}>
              <CardHeader className="pb-2">
                <CardTitle className={`text-sm font-medium ${subtextColor}`}>
                  Departamentos Activos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className={`text-2xl font-bold ${textColor}`}>
                  {departments.filter((dep) => dep.status === "Activo").length}
                </div>
                <p className="text-xs text-gray-500 flex items-center mt-1">
                  <span>{departments.length} departamentos en total</span>
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
            <Card className={cardBg}>
              <CardHeader>
                <CardTitle className={textColor}>
                  Solicitudes Recientes
                </CardTitle>
                <CardDescription className={subtextColor}>
                  Últimas solicitudes de horas extras
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Usuario
                        </th>
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Fecha
                        </th>
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Tipo
                        </th>
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Estado
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {recentRequests.length === 0 ? (
                        <tr>
                          <td
                            colSpan="4"
                            className="text-center py-4 text-sm"
                            style={{ color: subtextColor }}
                          >
                            No hay solicitudes recientes.
                          </td>
                        </tr>
                      ) : (
                        recentRequests.map((request) => (
                          <tr
                            key={request.id}
                            className="border-b hover:bg-gray-50"
                          >
                            <td className={`py-2 px-1 text-sm ${textColor}`}>
                              {request.userName || request.user || ""}
                            </td>
                            <td className={`py-2 px-1 text-sm ${textColor}`}>
                              {request.date || request.dateOfExtraHours || ""}
                            </td>
                            <td className={`py-2 px-1 text-sm ${textColor}`}>
                              {request.type || request.extraHourType || ""}
                            </td>
                            <td className="py-2 px-1 text-sm">
                              <span
                                className={`px-2 py-1 rounded-full text-xs ${
                                  request.status === "Aprobado"
                                    ? "bg-green-100 text-green-800"
                                    : request.status === "Rechazado"
                                    ? "bg-red-100 text-red-800"
                                    : "bg-yellow-100 text-yellow-800"
                                }`}
                              >
                                {request.status}
                              </span>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>

            <Card className={cardBg}>
              <CardHeader>
                <CardTitle className={textColor}>Departamentos</CardTitle>
                <CardDescription className={subtextColor}>
                  Empleados y horas extras por departamento
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Departamento
                        </th>
                        <th
                          className={`text-left py-2 px-1 font-medium ${subtextColor}`}
                        >
                          Empleados
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {departmentStats.length === 0 ? (
                        <tr>
                          <td
                            colSpan="3"
                            className="text-center py-4 text-sm"
                            style={{ color: subtextColor }}
                          >
                            No hay estadísticas de departamentos.
                          </td>
                        </tr>
                      ) : (
                        departmentStats.map((dept, index) => (
                          <tr key={index} className="border-b hover:bg-gray-50">
                            <td className={`py-2 px-1 text-sm ${textColor}`}>
                              {dept.department}
                            </td>
                            <td className={`py-2 px-1 text-sm ${textColor}`}>
                              {dept.employees}
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default Overview;
