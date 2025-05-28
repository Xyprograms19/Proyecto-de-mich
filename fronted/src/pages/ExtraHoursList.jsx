import React, { useEffect, useState } from "react";
import { PlusCircle, Edit, Trash2 } from "lucide-react";
import { useTheme } from "../context/ThemeContext";

const ExtraHoursList = ({ userId }) => {
  const { isLightTheme } = useTheme();
  const [extraHours, setExtraHours] = useState([]);
  const [newHour, setNewHour] = useState({
    userId: userId || "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    status: "Pendiente",
  });
  const [editId, setEditId] = useState(null);
  const [editData, setEditData] = useState({ reason: "", status: "" });

  const colors = {
    light: {
      primary: "#3B82F6",
      accent: "#10B981",
      background: "#FFFFFF",
      cardBackground: "#FFFFFF",
      text: "#1F2937",
      subtleText: "#6B7280",
      border: "#E5E7EB",
      inputBorder: "#D1D5DB",
      buttonPrimaryBg: "#3B82F6",
      buttonPrimaryText: "white",
      buttonDangerBg: "#EF4444",
      buttonDangerText: "white",
      buttonSecondaryBg: "#6B7280",
      buttonSecondaryText: "white",
    },
    dark: {
      primary: "#60A5FA",
      accent: "#34D399",
      background: "#111827",
      cardBackground: "#1F2937",
      text: "#F9FAFB",
      subtleText: "#9CA3AF",
      border: "#374151",
      inputBorder: "#4B5563",
      buttonPrimaryBg: "#60A5FA",
      buttonPrimaryText: "white",
      buttonDangerBg: "#DC2626",
      buttonDangerText: "white",
      buttonSecondaryBg: "#4B5563",
      buttonSecondaryText: "white",
    },
  };
  const currentTheme = isLightTheme ? colors.light : colors.dark;

  useEffect(() => {
    fetchExtraHours();
  }, [userId]);

  const fetchExtraHours = async () => {
    try {
      const url = userId
        ? `http://localhost:5023/api/extrahours?userId=${userId}`
        : "http://localhost:5023/api/extrahours";
      const res = await fetch(url);
      const data = await res.json();
      setExtraHours(data);
    } catch (error) {
      alert("Error al cargar las horas extras: " + error.message);
    }
  };

  const handleInputChange = (e) => {
    setNewHour({ ...newHour, [e.target.name]: e.target.value });
  };

  const addExtraHour = async () => {
    if (
      !newHour.userId ||
      !newHour.date ||
      !newHour.startTime ||
      !newHour.endTime ||
      !newHour.reason
    ) {
      alert("Por favor, completa todos los campos para añadir una hora extra.");
      return;
    }

    try {
      const res = await fetch("http://localhost:5023/api/extrahours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(newHour),
      });
      if (res.ok) {
        fetchExtraHours();
        setNewHour({
          userId: userId || "",
          date: "",
          startTime: "",
          endTime: "",
          reason: "",
          status: "Pendiente",
        });
      } else {
        alert("Error al agregar la hora extra.");
      }
    } catch (error) {
      alert("Error de conexión al agregar: " + error.message);
    }
  };

  const handleEditInit = (hour) => {
    setEditId(hour.id);
    setEditData({ reason: hour.reason, status: hour.status });
  };

  const handleEditSave = async (id) => {
    const extraHourToUpdate = extraHours.find((hour) => hour.id === id);

    if (!extraHourToUpdate) {
      alert("No se encontró la hora extra a actualizar.");
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
          status: editData.status,
          rejectionReason: extraHourToUpdate.rejectionReason,
          approvedRejectedAt: extraHourToUpdate.approvedRejectedAt,
          approvedRejectedByUserId: extraHourToUpdate.approvedRejectedByUserId,
        }),
      });
      if (res.ok) {
        setExtraHours((prev) =>
          prev.map((h) =>
            h.id === id
              ? { ...h, reason: editData.reason, status: editData.status }
              : h
          )
        );
        setEditId(null);
      } else {
        alert("Error al actualizar la hora extra");
      }
    } catch (error) {
      alert("Error al conectar con el servidor: " + error.message);
    }
  };

  const handleEditCancel = () => {
    setEditId(null);
  };

  const handleDelete = async (id) => {
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
      alert("Error de conexión al eliminar: " + error.message);
    }
  };

  const handleChange = (e) => {
    setEditData({ ...editData, [e.target.name]: e.target.value });
  };

  return (
    <div className="space-y-6">
      <div
        className="p-4 rounded-xl border"
        style={{
          borderColor: currentTheme.border,
          backgroundColor: currentTheme.cardBackground,
        }}
      >
        <h3
          className="text-lg font-semibold mb-4 flex items-center"
          style={{ color: currentTheme.primary }}
        >
          <PlusCircle className="mr-2" size={20} /> Añadir Nueva Hora Extra
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {!userId && (
            <div>
              <label
                htmlFor="new-userId"
                className="block text-sm font-medium"
                style={{ color: currentTheme.subtleText }}
              >
                Usuario ID
              </label>
              <input
                type="text"
                id="new-userId"
                name="userId"
                value={newHour.userId}
                onChange={handleInputChange}
                className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm"
                style={{
                  backgroundColor: currentTheme.background,
                  borderColor: currentTheme.inputBorder,
                  color: currentTheme.text,
                  border: "1px solid",
                }}
              />
            </div>
          )}
          <div>
            <label
              htmlFor="new-date"
              className="block text-sm font-medium"
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
              className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.inputBorder,
                color: currentTheme.text,
                border: "1px solid",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="new-startTime"
              className="block text-sm font-medium"
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
              className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.inputBorder,
                color: currentTheme.text,
                border: "1px solid",
              }}
            />
          </div>
          <div>
            <label
              htmlFor="new-endTime"
              className="block text-sm font-medium"
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
              className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.inputBorder,
                color: currentTheme.text,
                border: "1px solid",
              }}
            />
          </div>
          <div className="col-span-1 md:col-span-2">
            <label
              htmlFor="new-reason"
              className="block text-sm font-medium"
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
              className="mt-1 block w-full rounded-md shadow-sm p-2 text-sm"
              style={{
                backgroundColor: currentTheme.background,
                borderColor: currentTheme.inputBorder,
                color: currentTheme.text,
                border: "1px solid",
              }}
            />
          </div>
        </div>
        <button
          onClick={addExtraHour}
          className="mt-6 w-full py-2 px-4 rounded-md font-semibold shadow-md transition-colors duration-200"
          style={{
            backgroundColor: currentTheme.buttonPrimaryBg,
            color: currentTheme.buttonPrimaryText,
          }}
        >
          Añadir Hora Extra
        </button>
      </div>
      <h3
        className="text-lg font-semibold mb-4"
        style={{ color: currentTheme.primary }}
      >
        Horas Registradas
      </h3>
      {extraHours.length === 0 ? (
        <p style={{ color: currentTheme.subtleText }}>
          No hay registros de horas extras disponibles.
        </p>
      ) : (
        <div
          className="overflow-x-auto rounded-lg shadow-md border"
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
              style={{ backgroundColor: isLightTheme ? "#F9FAFB" : "#374151" }}
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
                  Usuario
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
                  className="hover:bg-opacity-50 transition-colors"
                  style={{ backgroundColor: currentTheme.cardBackground }}
                >
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {hour.id}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {hour.userId}
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
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <input
                          type="text"
                          name="reason"
                          value={editData.reason}
                          onChange={handleChange}
                          className="w-full rounded-md shadow-sm p-1 text-sm"
                          style={{
                            backgroundColor: currentTheme.background,
                            borderColor: currentTheme.inputBorder,
                            color: currentTheme.text,
                            border: "1px solid",
                          }}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <select
                          name="status"
                          value={editData.status}
                          onChange={handleChange}
                          className="w-full rounded-md shadow-sm p-1 text-sm"
                          style={{
                            backgroundColor: currentTheme.background,
                            borderColor: currentTheme.inputBorder,
                            color: currentTheme.text,
                            border: "1px solid",
                          }}
                        >
                          <option value="Pendiente">Pendiente</option>
                          <option value="Aprobado">Aprobado</option>
                          <option value="Rechazado">Rechazado</option>
                        </select>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => handleEditSave(hour.id)}
                          className="p-2 rounded-md font-semibold text-xs flex items-center justify-center transition-colors duration-200"
                          style={{
                            backgroundColor: currentTheme.buttonPrimaryBg,
                            color: currentTheme.buttonPrimaryText,
                          }}
                        >
                          Guardar
                        </button>
                        <button
                          onClick={handleEditCancel}
                          className="p-2 rounded-md font-semibold text-xs flex items-center justify-center transition-colors duration-200"
                          style={{
                            backgroundColor: currentTheme.buttonSecondaryBg,
                            color: currentTheme.buttonSecondaryText,
                          }}
                        >
                          Cancelar
                        </button>
                      </td>
                    </>
                  ) : (
                    <>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        {hour.reason}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm">
                        <span
                          className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                            hour.status === "Aprobado"
                              ? "bg-green-100 text-green-800"
                              : hour.status === "Rechazado"
                              ? "bg-red-100 text-red-800"
                              : "bg-yellow-100 text-yellow-800"
                          }`}
                        >
                          {hour.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm flex space-x-2">
                        <button
                          onClick={() => handleEditInit(hour)}
                          className="p-2 rounded-md hover:bg-gray-200 transition-colors duration-200"
                          style={{ color: currentTheme.subtleText }}
                          aria-label="Editar"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => handleDelete(hour.id)}
                          className="p-2 rounded-md hover:bg-red-100 transition-colors duration-200"
                          style={{ color: currentTheme.buttonDangerBg }}
                          aria-label="Eliminar"
                        >
                          <Trash2 size={16} />
                        </button>
                      </td>
                    </>
                  )}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default ExtraHoursList;
