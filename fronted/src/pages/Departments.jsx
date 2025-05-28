import React, { useState, useEffect } from "react";
import departmentService from "../services/departmentService";
import { useTheme } from "../context/ThemeContext";
import {
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Undo2,
  Briefcase,
  Users,
  Clock,
  CircleDotDashed,
} from "lucide-react";

const Departments = () => {
  const { isLightTheme } = useTheme();

  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    employees: "",
    totalExtraHours: "",
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
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await departmentService.getDepartments();
      setDepartments(response.data);
    } catch (err) {
      console.error("Error fetching departments:", err);
      setError("No se pudieron cargar los departamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleAddDepartment = async () => {
    try {
      const departmentToAdd = {
        ...newDepartment,
        employees: parseInt(newDepartment.employees) || 0,
        totalExtraHours: parseInt(newDepartment.totalExtraHours) || 0,
      };
      const response = await departmentService.createDepartment(
        departmentToAdd
      );
      setDepartments([...departments, response.data]);
      setNewDepartment({
        name: "",
        employees: "",
        totalExtraHours: "",
        status: "Activo",
      });
      setEditingDepartment(null);
    } catch (err) {
      console.error("Error adding department:", err);
      setError("No se pudo agregar el departamento.");
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este departamento?")
    ) {
      try {
        await departmentService.deleteDepartment(id);
        setDepartments(
          departments.filter((department) => department.id !== id)
        );
      } catch (err) {
        console.error("Error deleting department:", err);
        setError("No se pudo eliminar el departamento.");
      }
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment(department);
  };

  const handleSaveEdit = async () => {
    try {
      const departmentToUpdate = {
        ...newDepartment,
        employees: parseInt(newDepartment.employees) || 0,
        totalExtraHours: parseInt(newDepartment.totalExtraHours) || 0,
      };
      await departmentService.updateDepartment(
        editingDepartment.id,
        departmentToUpdate
      );
      setDepartments(
        departments.map((department) =>
          department.id === editingDepartment.id
            ? departmentToUpdate
            : department
        )
      );
      setEditingDepartment(null);
      setNewDepartment({
        name: "",
        employees: "",
        totalExtraHours: "",
        status: "Activo",
      });
    } catch (err) {
      console.error("Error saving department edit:", err);
      setError("No se pudo guardar la edición del departamento.");
    }
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setNewDepartment({
      name: "",
      employees: "",
      totalExtraHours: "",
      status: "Activo",
    });
  };

  const renderDepartmentForm = () => (
    <div
      className="mt-8 p-6 rounded shadow-lg transition-all duration-300 ease-in-out"
      style={{
        backgroundColor: currentTheme.cardBackground,
        color: currentTheme.text,
        border: `1px solid ${currentTheme.border}`,
      }}
    >
      <h2
        className="text-xl font-bold mb-4"
        style={{ color: currentTheme.primary }}
      >
        {editingDepartment && editingDepartment.id
          ? "Editar Departamento"
          : "Nuevo Departamento"}
      </h2>
      <div className="space-y-4">
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: currentTheme.subtleText }}
          >
            Nombre
          </label>
          <input
            type="text"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
            value={newDepartment.name}
            onChange={(e) =>
              setNewDepartment({ ...newDepartment, name: e.target.value })
            }
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: currentTheme.subtleText }}
          >
            Empleados
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
            value={newDepartment.employees}
            onChange={(e) =>
              setNewDepartment({ ...newDepartment, employees: e.target.value })
            }
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: currentTheme.subtleText }}
          >
            Horas Extras (Mes)
          </label>
          <input
            type="number"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
            value={newDepartment.totalExtraHours}
            onChange={(e) =>
              setNewDepartment({
                ...newDepartment,
                totalExtraHours: e.target.value,
              })
            }
          />
        </div>
        <div>
          <label
            className="block text-sm font-medium"
            style={{ color: currentTheme.subtleText }}
          >
            Estado
          </label>
          <select
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            style={{
              backgroundColor: isLightTheme ? "#f9fafb" : "#374151",
              borderColor: currentTheme.border,
              color: currentTheme.text,
            }}
            value={newDepartment.status}
            onChange={(e) =>
              setNewDepartment({ ...newDepartment, status: e.target.value })
            }
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
      </div>
      <div className="flex justify-end mt-6 space-x-3">
        <button
          className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: currentTheme.border,
            color: currentTheme.subtleText,
          }}
          onClick={handleCancelEdit}
        >
          <Undo2 size={18} className="mr-2" /> Cancelar
        </button>
        <button
          className="flex items-center px-4 py-2 rounded-lg transition-colors duration-200"
          style={{
            backgroundColor: currentTheme.primary,
            color: "white",
          }}
          onClick={
            editingDepartment && editingDepartment.id
              ? handleSaveEdit
              : handleAddDepartment
          }
        >
          <Save size={18} className="mr-2" />
          {editingDepartment && editingDepartment.id
            ? "Guardar Cambios"
            : "Agregar Departamento"}
        </button>
      </div>
    </div>
  );

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
          Gestión Centralizada de Departamentos
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
            Cargando departamentos...
          </div>
        ) : (
          <>
            {renderDepartmentForm()}

            <div
              className="mt-8 p-6 rounded shadow-lg"
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
                    Lista de Departamentos
                  </h2>
                  <p
                    className="text-md"
                    style={{ color: currentTheme.subtleText }}
                  >
                    Visualiza y gestiona todos los departamentos existentes.
                  </p>
                </div>
                {!editingDepartment && (
                  <button
                    className="flex items-center px-5 py-2 rounded-lg text-white transition-colors duration-200"
                    style={{
                      backgroundColor: currentTheme.accent,
                    }}
                    onClick={() =>
                      setEditingDepartment({
                        id: null,
                        name: "",
                        employees: "",
                        totalExtraHours: "",
                        status: "Activo",
                      })
                    }
                  >
                    <PlusCircle size={20} className="mr-2" /> Nuevo Departamento
                  </button>
                )}
              </div>

              {departments.length === 0 ? (
                <div
                  className="text-center py-4"
                  style={{ color: currentTheme.subtleText }}
                >
                  No hay departamentos para mostrar. Agrega uno nuevo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="p-6 rounded-lg shadow-md transition-transform duration-200 ease-in-out hover:scale-[1.02] relative"
                      style={{
                        backgroundColor: currentTheme.cardBackground,
                        border: `1px solid ${currentTheme.border}`,
                      }}
                    >
                      <h3
                        className="text-xl font-bold mb-3"
                        style={{ color: currentTheme.primary }}
                      >
                        {department.name}
                      </h3>
                      <div
                        className="space-y-2 text-sm"
                        style={{ color: currentTheme.subtleText }}
                      >
                        <div className="flex items-center">
                          <Users
                            size={16}
                            className="mr-2"
                            color={currentTheme.text}
                          />
                          <span>
                            Empleados:{" "}
                            <span
                              className="font-semibold"
                              style={{ color: currentTheme.text }}
                            >
                              {department.employees}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock
                            size={16}
                            className="mr-2"
                            color={currentTheme.text}
                          />
                          <span>
                            Horas Extras (Mes):{" "}
                            <span
                              className="font-semibold"
                              style={{ color: currentTheme.text }}
                            >
                              {department.totalExtraHours}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CircleDotDashed
                            size={16}
                            className="mr-2"
                            color={currentTheme.text}
                          />
                          <span>
                            Estado:
                            <span
                              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                                department.status === "Activo"
                                  ? "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300"
                                  : "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300"
                              }`}
                            >
                              {department.status}
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className="flex justify-end space-x-3 mt-4">
                        <button
                          onClick={() => handleEditDepartment(department)}
                          className="flex items-center text-blue-500 hover:text-blue-700 transition-colors duration-200"
                        >
                          <Edit size={16} className="mr-1" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id)}
                          className="flex items-center text-red-500 hover:text-red-700 transition-colors duration-200"
                        >
                          <Trash2 size={16} className="mr-1" /> Eliminar
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Departments;
