import React, { useState, useEffect } from "react";
import extraHourTypeService from "../services/extraHourTypeService";
import { useTheme } from "../context/ThemeContext";
import {
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Undo2,
  ListPlus,
  Percent,
  CircleDotDashed,
} from "lucide-react";

const ExtraHours = () => {
  const { isLightTheme } = useTheme();

  const [extraHoursTypes, setExtraHoursTypes] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentType, setCurrentType] = useState({
    id: null,
    type: "",
    multiplier: "",
    status: "Activo",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const colors = {
    light: {
      primary: "#3B82F6",
      accent: "#10B981",
      background: "#F3F4F6",
      cardBackground: "#FFFFFF",
      text: "#1F2937",
      subtleText: "#6B7280",
      border: "#E5E7EB",
      success: "#10B981",
      danger: "#EF4444",
      info: "#3B82F6",
    },
    dark: {
      primary: "#60A5FA",
      accent: "#34D399",
      background: "#111827",
      cardBackground: "#1F2937",
      text: "#F9FAFB",
      subtleText: "#9CA3AF",
      border: "#374151",
      success: "#34D399",
      danger: "#F87171",
      info: "#60A5FA",
    },
  };

  const currentTheme = isLightTheme ? colors.light : colors.dark;

  useEffect(() => {
    fetchExtraHourTypes();
  }, []);

  const fetchExtraHourTypes = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await extraHourTypeService.getExtraHourTypes();
      setExtraHoursTypes(response.data);
    } catch (err) {
      console.error("Error fetching extra hour types:", err);
      setError("No se pudieron cargar los tipos de horas extras.");
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteType = async (id) => {
    if (
      window.confirm(
        "¿Estás seguro de que quieres eliminar este tipo de hora extra?"
      )
    ) {
      try {
        await extraHourTypeService.deleteExtraHourType(id);
        setExtraHoursTypes(extraHoursTypes.filter((type) => type.id !== id));
      } catch (err) {
        console.error("Error deleting extra hour type:", err);
        setError("No se pudo eliminar el tipo de hora extra.");
      }
    }
  };

  const handleOpenModal = (
    type = { id: null, type: "", multiplier: "", status: "Activo" }
  ) => {
    setCurrentType(type);
    setIsEditMode(!!type.id);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setCurrentType({ id: null, type: "", multiplier: "", status: "Activo" });
  };

  const handleSaveType = async () => {
    try {
      const typeToSave = {
        ...currentType,
        multiplier: parseFloat(currentType.multiplier) || 0,
      };

      if (isEditMode) {
        await extraHourTypeService.updateExtraHourType(
          typeToSave.id,
          typeToSave
        );
        setExtraHoursTypes(
          extraHoursTypes.map((type) =>
            type.id === typeToSave.id ? typeToSave : type
          )
        );
      } else {
        const response = await extraHourTypeService.createExtraHourType(
          typeToSave
        );
        setExtraHoursTypes([...extraHoursTypes, response.data]);
      }
      handleCloseModal();
    } catch (err) {
      console.error("Error saving extra hour type:", err);
      setError("No se pudo guardar el tipo de hora extra.");
    }
  };

  return (
    <div
      className="min-h-screen p-4 sm:p-6"
      style={{
        backgroundColor: currentTheme.background,
        color: currentTheme.text,
      }}
    >
      <div className="max-w-4xl mx-auto">
        <h1
          className="text-3xl font-extrabold mb-2"
          style={{ color: currentTheme.primary }}
        >
          Panel de Administración
        </h1>
        <p className="text-lg mb-8" style={{ color: currentTheme.subtleText }}>
          Gestión de Tipos de Horas Extras
        </p>

        {error && (
          <div
            className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4"
            role="alert"
          >
            <strong className="font-bold">¡Error!</strong>
            <span className="block sm:inline"> {error}</span>
            <span
              className="absolute top-0 bottom-0 right-0 px-4 py-3"
              onClick={() => setError(null)}
            >
              <XCircle
                size={18}
                className="text-red-500 hover:text-red-700 cursor-pointer"
              />
            </span>
          </div>
        )}

        {loading ? (
          <div
            className="text-center py-8"
            style={{ color: currentTheme.subtleText }}
          >
            Cargando tipos de horas extras...
          </div>
        ) : (
          <div
            className="bg-white p-6 rounded-lg shadow-lg"
            style={{
              backgroundColor: currentTheme.cardBackground,
              border: `1px solid ${currentTheme.border}`,
            }}
          >
            <div className="flex justify-between items-center mb-6">
              <div>
                <h2
                  className="text-2xl font-bold"
                  style={{ color: currentTheme.text }}
                >
                  Tipos de Horas Extras
                </h2>
                <p
                  className="text-md"
                  style={{ color: currentTheme.subtleText }}
                >
                  Administra las categorías y multiplicadores para el cálculo de
                  horas extras.
                </p>
              </div>
              <button
                onClick={() => handleOpenModal()}
                className="flex items-center px-5 py-2 rounded-lg text-white transition-colors duration-200"
                style={{
                  backgroundColor: currentTheme.accent,
                }}
              >
                <PlusCircle size={20} className="mr-2" /> Nuevo Tipo
              </button>
            </div>

            {extraHoursTypes.length === 0 ? (
              <div
                className="text-center py-4"
                style={{ color: currentTheme.subtleText }}
              >
                No hay tipos de horas extras para mostrar. Agrega uno nuevo.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table
                  className="min-w-full divide-y"
                  style={{ borderColor: currentTheme.border }}
                >
                  <thead
                    style={{
                      backgroundColor: isLightTheme ? "#F9FAFB" : "#1F2937",
                    }}
                  >
                    <tr>
                      <th
                        className="py-3 px-4 text-center text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        ID
                      </th>
                      <th
                        className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Tipo
                      </th>
                      <th
                        className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Multiplicador
                      </th>
                      <th
                        className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
                        style={{ color: currentTheme.subtleText }}
                      >
                        Estado
                      </th>
                      <th
                        className="py-3 px-4 text-left text-xs font-medium uppercase tracking-wider"
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
                      backgroundColor: currentTheme.cardBackground,
                    }}
                  >
                    {extraHoursTypes.map((type) => (
                      <tr
                        key={type.id}
                        className="transition-colors duration-150 hover:bg-gray-50 dark:hover:bg-gray-700"
                      >
                        <td
                          className="py-2 px-4 text-center text-sm"
                          style={{ color: currentTheme.text }}
                        >
                          {type.id}
                        </td>
                        <td
                          className="py-2 px-4 text-left text-sm flex items-center"
                          style={{ color: currentTheme.text }}
                        >
                          <ListPlus
                            size={16}
                            className="mr-2"
                            style={{ color: currentTheme.subtleText }}
                          />
                          {type.type}
                        </td>
                        <td
                          className="py-2 px-4 text-left text-sm flex items-center"
                          style={{ color: currentTheme.text }}
                        >
                          <Percent
                            size={16}
                            className="mr-2"
                            style={{ color: currentTheme.subtleText }}
                          />
                          {type.multiplier.toFixed(2)}
                        </td>
                        <td className="py-2 px-4 text-left text-sm">
                          <span
                            className={`px-2 py-1 rounded-full text-xs font-medium ${
                              type.status === "Activo"
                                ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                            }`}
                          >
                            {type.status}
                          </span>
                        </td>
                        <td className="py-2 px-4 text-left text-sm">
                          <button
                            onClick={() => handleOpenModal(type)}
                            className="text-blue-500 hover:text-blue-700 transition-colors duration-200 flex items-center"
                          >
                            <Edit size={16} className="mr-1" /> Editar
                          </button>
                          <button
                            onClick={() => handleDeleteType(type.id)}
                            className="text-red-500 hover:text-red-700 transition-colors duration-200 ml-3 flex items-center"
                          >
                            <Trash2 size={16} className="mr-1" /> Eliminar
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}

        {isModalOpen && (
          <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
            <div
              className="p-6 rounded-lg shadow-lg w-full max-w-md animate-fade-in-down"
              style={{
                backgroundColor: currentTheme.cardBackground,
                color: currentTheme.text,
                border: `1px solid ${currentTheme.border}`,
              }}
            >
              <h2
                className="text-2xl font-bold mb-4"
                style={{ color: currentTheme.primary }}
              >
                {isEditMode ? "Editar Tipo" : "Nuevo Tipo"}
              </h2>
              <div className="space-y-4">
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: currentTheme.subtleText }}
                  >
                    Tipo
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                    value={currentType.type}
                    onChange={(e) =>
                      setCurrentType({ ...currentType, type: e.target.value })
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: currentTheme.subtleText }}
                  >
                    Multiplicador
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                    value={currentType.multiplier}
                    onChange={(e) =>
                      setCurrentType({
                        ...currentType,
                        multiplier: parseFloat(e.target.value),
                      })
                    }
                  />
                </div>
                <div>
                  <label
                    className="block text-sm font-medium mb-1"
                    style={{ color: currentTheme.subtleText }}
                  >
                    Estado
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded focus:ring-2 focus:ring-blue-500"
                    style={{
                      backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
                      borderColor: currentTheme.border,
                      color: currentTheme.text,
                    }}
                    value={currentType.status}
                    onChange={(e) =>
                      setCurrentType({ ...currentType, status: e.target.value })
                    }
                  >
                    <option value="Activo">Activo</option>
                    <option value="Inactivo">Inactivo</option>
                  </select>
                </div>
              </div>
              <div className="flex justify-end mt-6 space-x-3">
                <button
                  onClick={handleCloseModal}
                  className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
                  style={{
                    backgroundColor: currentTheme.border,
                    color: currentTheme.subtleText,
                  }}
                >
                  <Undo2 size={18} className="mr-2" /> Cancelar
                </button>
                <button
                  onClick={handleSaveType}
                  className="flex items-center px-4 py-2 rounded-lg text-white transition-colors duration-200"
                  style={{
                    backgroundColor: currentTheme.primary,
                  }}
                >
                  <Save size={18} className="mr-2" />{" "}
                  {isEditMode ? "Guardar Cambios" : "Crear Tipo"}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ExtraHours;
