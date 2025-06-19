import React, { useEffect, useState, useMemo } from "react";
import {
  PlusCircle,
  Edit,
  Trash2,
  Mail,
  Briefcase,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ArrowLeft,
  Menu,
  X,
  CalendarDays,
  Hourglass,
  AlertTriangle,
} from "lucide-react";
import { useTheme } from "../context/ThemeContext";
import authService from "../services/authService";

const UserPage = () => {
  const { isLightTheme } = useTheme();
  const [extraHours, setExtraHours] = useState([]);
  const [newHour, setNewHour] = useState({
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    status: "Pendiente",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ reason: "" });
  // const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const [showRegisterForm, setShowRegisterForm] = useState(false);

  const currentUser = authService.getCurrentUser();
  const currentUserId = currentUser?.userId;

  const mockCurrentUserDetails = {
    userId: "user123",
    name: currentUser?.username || "Usuario Desconocido",
    email: currentUser?.email || "juan.perez@company.com",
    role: "Empleado",
    department: "Desarrollo",
    position: "Desarrollador",
    profilePicture: "https://via.placeholder.com/100/3B82F6/FFFFFF?text=JP",
  };

  const colors = {
    light: {
      primary: "#3B82F6",
      accent: "#10B981",
      background: "#F9FAFB",
      cardBackground: "#FFFFFF",
      text: "#1F2937",
      subtleText: "#6B7280",
      border: "#E5E7EB",
      iconBackground: "#EFF6FF",
      inputBackground: "#FFFFFF",
      inputBorder: "#D1D5DB",
      buttonPrimaryBg: "#3B82F6",
      buttonPrimaryText: "white",
      buttonDangerBg: "#EF4444",
      buttonDangerText: "white",
      buttonSecondaryBg: "#6B7280",
      buttonSecondaryText: "white",
      summaryCardBg: "#FFFFFF",
      summaryCardBorder: "#E5E7EB",
      summaryCardText: "#1F2937",
      summaryIconBg: "#EFF6FF",
      summaryIconColor: "#3B82F6",
    },
    dark: {
      primary: "#60A5FA",
      accent: "#34D399",
      background: "#1F2937",
      cardBackground: "#111827",
      text: "#F9FAFB",
      subtleText: "#9CA3AF",
      border: "#374151",
      iconBackground: "#1E40AF",
      inputBackground: "#1F2937",
      inputBorder: "#4B5563",
      buttonPrimaryBg: "#60A5FA",
      buttonPrimaryText: "white",
      buttonDangerBg: "#DC2626",
      buttonDangerText: "white",
      buttonSecondaryBg: "#4B5563",
      buttonSecondaryText: "white",
      summaryCardBg: "#111827",
      summaryCardBorder: "#374151",
      summaryCardText: "#F9FAFB",
      summaryIconBg: "#1E40AF",
      summaryIconColor: "#60A5FA",
    },
  };
  const currentTheme = isLightTheme ? colors.light : colors.dark;

  useEffect(() => {
    if (currentUserId) {
      fetchExtraHours();
    } else {
      setExtraHours([]);
    }
  }, [currentUserId]);

  const fetchExtraHours = async () => {
    if (!currentUserId) return;

    try {
      const url = `http://localhost:5023/api/extrahours?userId=${currentUserId}`;
      const res = await fetch(url);
      if (!res.ok) {
        throw new Error(`HTTP error! status: ${res.status}`);
      }
      const data = await res.json();
      setExtraHours(data);
    } catch (error) {
      console.error("Error al cargar las horas extras: ", error);
      alert("Error al cargar tus horas extras. Inténtalo de nuevo.");
    }
  };

  const handleInputChange = (e) => {
    setNewHour({ ...newHour, [e.target.name]: e.target.value });
  };

  const addExtraHour = async () => {
    if (!currentUserId) {
      alert("Error: No hay un usuario logeado para registrar horas extras.");
      return;
    }

    if (
      !newHour.date ||
      !newHour.startTime ||
      !newHour.endTime ||
      !newHour.reason
    ) {
      alert("Por favor, completa todos los campos para añadir una hora extra.");
      return;
    }

    const start = new Date(`2000/01/01 ${newHour.startTime}`);
    let end = new Date(`2000/01/01 ${newHour.endTime}`);
    if (end < start) {
      end.setDate(end.getDate() + 1);
    }
    if (start >= end) {
      alert("La hora de inicio debe ser anterior a la hora de fin.");
      return;
    }

    try {
      const extraHourData = {
        ...newHour,
        userId: currentUserId,
        status: "Pendiente",
      };

      const res = await fetch("http://localhost:5023/api/extrahours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(extraHourData),
      });
      if (res.ok) {
        fetchExtraHours();
        setNewHour({
          date: "",
          startTime: "",
          endTime: "",
          reason: "",
          status: "Pendiente",
        });

        setShowRegisterForm(false);
      } else {
        alert("Error al agregar la hora extra.");
      }
    } catch (error) {
      console.error("Error de conexión al agregar: ", error);
      alert("Error de conexión al agregar: " + error.message);
    }
  };

  const handleEditInit = (hour) => {
    if (hour.userId === currentUserId && hour.status === "Pendiente") {
      setEditId(hour.id);
      setEditData({ reason: hour.reason });
    } else if (hour.userId !== currentUserId) {
      alert("No tienes permisos para editar esta hora extra.");
    } else {
      alert("Las horas extras Aprobadas o Rechazadas no pueden ser editadas.");
    }
  };

  const handleEditSave = async (id) => {
    const extraHourToUpdate = extraHours.find((hour) => hour.id === id);

    if (!extraHourToUpdate) {
      alert("No se encontró la hora extra a actualizar.");
      return;
    }

    if (
      extraHourToUpdate.userId !== currentUserId ||
      extraHourToUpdate.status !== "Pendiente"
    ) {
      alert(
        "No tienes permisos para modificar esta hora extra o su estado no lo permite."
      );
      setEditId(null);
      return;
    }

    try {
      const res = await fetch(`http://localhost:5023/api/extrahours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: extraHourToUpdate.id,
          userId: extraHourToUpdate.userId,
          date: extraHourToUpdate.date,
          startTime: extraHourToUpdate.startTime,
          endTime: extraHourToUpdate.endTime,
          reason: editData.reason,
          status: extraHourToUpdate.status,
          rejectionReason: extraHourToUpdate.rejectionReason,
          approvedRejectedAt: extraHourToUpdate.approvedRejectedAt,
          approvedRejectedByUserId: extraHourToUpdate.approvedRejectedByUserId,
        }),
      });
      if (res.ok) {
        fetchExtraHours();
        setEditId(null);
      } else {
        alert("Error al actualizar la hora extra");
      }
    } catch (error) {
      console.error("Error al conectar con el servidor: ", error);
      alert("Error al conectar con el servidor: " + error.message);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = async (id) => {
    const extraHourToDelete = extraHours.find((hour) => hour.id === id);

    if (
      extraHourToDelete.userId !== currentUserId ||
      extraHourToDelete.status !== "Pendiente"
    ) {
      alert(
        "No tienes permisos para eliminar esta hora extra o su estado no lo permite."
      );
      return;
    }

    if (!window.confirm("¿Seguro que quieres eliminar esta hora extra?"))
      return;
    try {
      const res = await fetch(`http://localhost:5023/api/extrahours/${id}`, {
        method: "DELETE",
      });
      if (res.ok) {
        setExtraHours((prev) => prev.filter((h) => h.id !== id));
      } else {
        alert("Error al eliminar la hora extra");
      }
    } catch (error) {
      console.error("Error de conexión al eliminar: ", error);
      alert("Error de conexión al eliminar: " + error.message);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case "Aprobado":
        return <CheckCircle2 className="text-green-500" size={16} />;
      case "Rechazado":
        return <XCircle className="text-red-500" size={16} />;
      case "Pendiente":
        return <AlertCircle className="text-yellow-500" size={16} />;
      default:
        return null;
    }
  };

  const calculateDuration = (startTime, endTime) => {
    const [startH, startM] = startTime.split(":").map(Number);
    const [endH, endM] = endTime.split(":").map(Number);

    const startDate = new Date(0, 0, 0, startH, startM);
    let endDate = new Date(0, 0, 0, endH, endM);

    if (endDate < startDate) {
      endDate.setDate(endDate.getDate() + 1);
    }

    const diffMs = endDate - startDate;
    return diffMs / (1000 * 60 * 60);
  };

  const summaryData = useMemo(() => {
    let totalHours = 0;
    let approvedHours = 0;
    let pendingHours = 0;

    extraHours.forEach((hour) => {
      const duration = calculateDuration(hour.startTime, hour.endTime);
      totalHours += duration;

      if (hour.status === "Aprobado") {
        approvedHours += duration;
      } else if (hour.status === "Pendiente") {
        pendingHours += duration;
      }
    });

    return {
      totalHours: totalHours.toFixed(1),
      approvedHours: approvedHours.toFixed(1),
      pendingHours: pendingHours.toFixed(1),
    };
  }, [extraHours]);

  return (
    <div
      className="min-h-screen p-4 sm:p-6 lg:p-8 transition-colors duration-200"
      style={{ backgroundColor: currentTheme.background }}
    >
      <div className="max-w-7xl mx-auto space-y-6">
        {/* Encabezado y botón Registrar Horas */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="flex-shrink-0">
              <img
                src={mockCurrentUserDetails.profilePicture}
                alt="Foto de Perfil"
                className="w-16 h-16 rounded-full object-cover border-4"
                style={{ borderColor: currentTheme.primary }}
              />
            </div>
            <div>
              <h1
                className="text-3xl font-bold"
                style={{ color: currentTheme.text }}
              >
                {mockCurrentUserDetails.name}
              </h1>
              <div
                className="flex items-center text-sm"
                style={{ color: currentTheme.subtleText }}
              >
                <Mail size={16} className="mr-1" />
                <span>{mockCurrentUserDetails.email}</span>
                <span className="mx-2 text-gray-400">|</span>
                <Briefcase size={16} className="mr-1" />
                <span>{mockCurrentUserDetails.department}</span>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowRegisterForm(true)}
            className="flex items-center px-4 py-2 rounded-md font-semibold shadow-md transition-all duration-300 hover:scale-105"
            style={{
              backgroundColor: currentTheme.buttonPrimaryBg,
              color: currentTheme.buttonPrimaryText,
            }}
          >
            <PlusCircle size={20} className="mr-2" /> Registrar Horas
          </button>
        </div>

        {/* Sección de Tarjetas de Resumen */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-6">
          {/* Tarjeta de Total Horas */}
          <div
            className="p-4 rounded-xl border shadow-sm flex items-center space-x-4"
            style={{
              borderColor: currentTheme.summaryCardBorder,
              backgroundColor: currentTheme.summaryCardBg,
            }}
          >
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: currentTheme.summaryIconBg,
                color: currentTheme.summaryIconColor,
              }}
            >
              <CalendarDays size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: currentTheme.subtleText }}>
                Total Horas
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: currentTheme.summaryCardText }}
              >
                {summaryData.totalHours}
              </p>
            </div>
          </div>

          {/* Tarjeta de Horas Aprobadas */}
          <div
            className="p-4 rounded-xl border shadow-sm flex items-center space-x-4"
            style={{
              borderColor: currentTheme.summaryCardBorder,
              backgroundColor: currentTheme.summaryCardBg,
            }}
          >
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: currentTheme.summaryIconBg,
                color: currentTheme.summaryIconColor,
              }}
            >
              <Hourglass size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: currentTheme.subtleText }}>
                Horas Aprobadas
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: currentTheme.summaryCardText }}
              >
                {summaryData.approvedHours}
              </p>
            </div>
          </div>

          {/* Tarjeta de Horas Pendientes */}
          <div
            className="p-4 rounded-xl border shadow-sm flex items-center space-x-4"
            style={{
              borderColor: currentTheme.summaryCardBorder,
              backgroundColor: currentTheme.summaryCardBg,
            }}
          >
            <div
              className="p-3 rounded-full"
              style={{
                backgroundColor: currentTheme.summaryIconBg,
                color: currentTheme.summaryIconColor,
              }}
            >
              <AlertTriangle size={24} />
            </div>
            <div>
              <p className="text-sm" style={{ color: currentTheme.subtleText }}>
                Horas Pendientes
              </p>
              <p
                className="text-2xl font-bold"
                style={{ color: currentTheme.summaryCardText }}
              >
                {summaryData.pendingHours}
              </p>
            </div>
          </div>
        </div>

        {currentUserId ? (
          <>
            {/* Sección Añadir Nueva Hora Extra - Renderizado Condicional */}
            {showRegisterForm && (
              <div
                className="p-4 sm:p-6 rounded-xl border shadow-lg transition-colors duration-200 mt-6"
                style={{
                  borderColor: currentTheme.border,
                  backgroundColor: currentTheme.cardBackground,
                }}
              >
                <h3
                  className="text-xl sm:text-2xl font-bold mb-6 flex items-center"
                  style={{ color: currentTheme.primary }}
                >
                  <PlusCircle className="mr-3" size={24} /> Registrar Nueva Hora
                  Extra
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
                  <div>
                    <label
                      htmlFor="new-date"
                      className="block text-sm font-medium mb-1"
                      style={{ color: currentTheme.subtleText }}
                    >
                      Fecha
                    </label>
                    <input
                      type="date"
                      id="new-date"
                      name="date"
                      value={newHour.date}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm sm:text-base transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        backgroundColor: currentTheme.inputBackground,
                        borderColor: currentTheme.inputBorder,
                        color: currentTheme.text,
                        border: "1px solid",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-startTime"
                      className="block text-sm font-medium mb-1"
                      style={{ color: currentTheme.subtleText }}
                    >
                      Hora Inicio
                    </label>
                    <input
                      type="time"
                      id="new-startTime"
                      name="startTime"
                      value={newHour.startTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm sm:text-base transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        backgroundColor: currentTheme.inputBackground,
                        borderColor: currentTheme.inputBorder,
                        color: currentTheme.text,
                        border: "1px solid",
                      }}
                    />
                  </div>
                  <div>
                    <label
                      htmlFor="new-endTime"
                      className="block text-sm font-medium mb-1"
                      style={{ color: currentTheme.subtleText }}
                    >
                      Hora Fin
                    </label>
                    <input
                      type="time"
                      id="new-endTime"
                      name="endTime"
                      value={newHour.endTime}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm sm:text-base transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        backgroundColor: currentTheme.inputBackground,
                        borderColor: currentTheme.inputBorder,
                        color: currentTheme.text,
                        border: "1px solid",
                      }}
                    />
                  </div>
                  <div className="col-span-1 md:col-span-2">
                    <label
                      htmlFor="new-reason"
                      className="block text-sm font-medium mb-1"
                      style={{ color: currentTheme.subtleText }}
                    >
                      Razón
                    </label>
                    <input
                      type="text"
                      id="new-reason"
                      name="reason"
                      value={newHour.reason}
                      onChange={handleInputChange}
                      className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm sm:text-base transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                      style={{
                        backgroundColor: currentTheme.inputBackground,
                        borderColor: currentTheme.inputBorder,
                        color: currentTheme.text,
                        border: "1px solid",
                      }}
                    />
                  </div>
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  {/* Botón para cerrar el formulario */}
                  <button
                    onClick={() => setShowRegisterForm(false)}
                    className="py-2.5 px-4 rounded-md font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                    style={{
                      backgroundColor: currentTheme.buttonSecondaryBg,
                      color: currentTheme.buttonSecondaryText,
                    }}
                  >
                    <X size={20} />
                    <span>Cancelar</span>
                  </button>
                  <button
                    onClick={addExtraHour}
                    className="py-2.5 px-4 rounded-md font-semibold shadow-md transition-all duration-300 hover:scale-[1.02] active:scale-95 flex items-center justify-center space-x-2"
                    style={{
                      backgroundColor: currentTheme.buttonPrimaryBg,
                      color: currentTheme.buttonPrimaryText,
                    }}
                  >
                    <PlusCircle size={20} />
                    <span>Añadir Hora Extra</span>
                  </button>
                </div>
              </div>
            )}

            {/* Tabla de horas extras */}
            <h3
              className="text-xl sm:text-2xl font-bold mb-4 mt-8"
              style={{ color: currentTheme.primary }}
            >
              Tus Horas Registradas
            </h3>

            {extraHours.length === 0 ? (
              <p
                className="text-center py-8 text-lg"
                style={{ color: currentTheme.subtleText }}
              >
                No hay registros de horas extras para tu usuario.
              </p>
            ) : (
              <div
                className="overflow-x-auto rounded-lg shadow-lg border transition-colors duration-200"
                style={{ borderColor: currentTheme.border }}
              >
                <table
                  className="min-w-full divide-y"
                  style={{
                    borderColor: currentTheme.border,
                    backgroundColor: currentTheme.cardBackground,
                  }}
                >
                  <thead
                    style={{
                      backgroundColor: isLightTheme ? "#F9FAFB" : "#374151",
                    }}
                  >
                    <tr>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        ID
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Fecha
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Inicio
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Fin
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Razón
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Estado
                      </th>
                      <th
                        scope="col"
                        className="px-6 py-3 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Acciones
                      </th>
                    </tr>
                  </thead>
                  <tbody
                    className="divide-y"
                    style={{
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                  >
                    {extraHours.map((hour) => (
                      <tr
                        key={hour.id}
                        className="hover:bg-opacity-50 transition-colors duration-200"
                        style={{ backgroundColor: currentTheme.cardBackground }}
                      >
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hour.id}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {new Date(hour.date).toLocaleDateString()}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hour.startTime}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          {hour.endTime}
                        </td>

                        {editId === hour.id ? (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            <input
                              type="text"
                              name="reason"
                              value={editData.reason}
                              onChange={handleChange}
                              className="w-full rounded-md shadow-sm p-1 text-sm transition-colors duration-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                              style={{
                                backgroundColor: currentTheme.inputBackground,
                                borderColor: currentTheme.inputBorder,
                                color: currentTheme.text,
                                border: "1px solid",
                              }}
                            />
                          </td>
                        ) : (
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {hour.reason}
                          </td>
                        )}

                        <td className="px-6 py-4 whitespace-nowrap text-sm">
                          <span
                            className={`inline-flex text-xs leading-5 font-semibold rounded-full items-center space-x-1 ${
                              hour.status === "Aprobado"
                                ? "text-green-600 dark:text-green-400"
                                : hour.status === "Rechazado"
                                ? "bg-red-100 text-red-800 dark:bg-red-800 dark:text-red-100 px-2"
                                : "text-yellow-600 dark:text-yellow-400"
                            }`}
                          >
                            {getStatusIcon(hour.status)}
                            <span>{hour.status}</span>
                          </span>
                        </td>

                        <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                          {editId === hour.id ? (
                            <>
                              <button
                                onClick={() => handleEditSave(hour.id)}
                                className="p-2 rounded-md font-semibold text-xs flex items-center justify-center transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor: currentTheme.buttonPrimaryBg,
                                  color: currentTheme.buttonPrimaryText,
                                }}
                              >
                                Guardar
                              </button>
                              <button
                                onClick={handleEditCancel}
                                className="p-2 rounded-md font-semibold text-xs flex items-center justify-center transition-all duration-300 hover:scale-110"
                                style={{
                                  backgroundColor:
                                    currentTheme.buttonSecondaryBg,
                                  color: currentTheme.buttonSecondaryText,
                                }}
                              >
                                Cancelar
                              </button>
                            </>
                          ) : (
                            <>
                              {hour.status === "Pendiente" && (
                                <>
                                  <button
                                    onClick={() => handleEditInit(hour)}
                                    className="p-2 rounded-md transition-colors duration-200 hover:bg-opacity-80"
                                    style={{
                                      backgroundColor:
                                        currentTheme.iconBackground,
                                      color: currentTheme.primary,
                                    }}
                                    aria-label="Editar"
                                  >
                                    <Edit size={16} />
                                  </button>
                                  <button
                                    onClick={() => handleDelete(hour.id)}
                                    className="p-2 rounded-md transition-colors duration-200 hover:bg-opacity-80"
                                    style={{
                                      backgroundColor:
                                        currentTheme.buttonDangerBg,
                                      color: currentTheme.buttonDangerText,
                                    }}
                                    aria-label="Eliminar"
                                  >
                                    <Trash2 size={16} />
                                  </button>
                                </>
                              )}
                            </>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </>
        ) : (
          <p
            style={{ color: currentTheme.subtleText }}
            className="text-center py-12 text-xl"
          >
            Por favor, inicia sesión para ver y gestionar tus horas extras.
          </p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
