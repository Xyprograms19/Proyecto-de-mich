import React, { useState, useEffect } from "react";
import axios from "axios";
import {
  XCircle,
  PlusCircle,
  Edit,
  Trash2,
  Save,
  Undo2,
  Users,
  Clock,
  CircleDotDashed,
} from "lucide-react";

const Departments = () => {
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [newDepartment, setNewDepartment] = useState({
    name: "",
    employees: "",
    status: "Activo",
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchDepartments();
  }, []);

  const fetchDepartments = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await axios.get("http://localhost:5023/api/departments");
      setDepartments(response.data);
    } catch (err) {
      console.error(err);
      setError("No se pudieron cargar los departamentos.");
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setNewDepartment({
      ...newDepartment,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    try {
      const departmentData = {
        name: newDepartment.name,
        employees: parseInt(newDepartment.employees) || 0,
        status: newDepartment.status,
      };

      if (editingDepartment && editingDepartment.id) {
        await axios.put(
          `http://localhost:5023/api/departments/${editingDepartment.id}`,
          departmentData
        );
        setDepartments(
          departments.map((department) =>
            department.id === editingDepartment.id
              ? { ...department, ...departmentData }
              : department
          )
        );
        setEditingDepartment(null);
      } else {
        const response = await axios.post(
          "http://localhost:5023/api/departments",
          departmentData
        );
        setDepartments([...departments, response.data]);
      }
      setNewDepartment({ name: "", employees: "", status: "Activo" });
    } catch (err) {
      console.error(err);
      setError("No se pudo guardar el departamento.");
    }
  };

  const handleDeleteDepartment = async (id) => {
    if (
      window.confirm("¿Estás seguro de que quieres eliminar este departamento?")
    ) {
      try {
        await axios.delete(`http://localhost:5023/api/departments/${id}`);
        setDepartments(
          departments.filter((department) => department.id !== id)
        );
      } catch (err) {
        console.error(err);
        setError("No se pudo eliminar el departamento.");
      }
    }
  };

  const handleEditDepartment = (department) => {
    setEditingDepartment(department);
    setNewDepartment({
      name: department.name,
      employees: department.employees,
      status: department.status,
    });
  };

  const handleCancelEdit = () => {
    setEditingDepartment(null);
    setNewDepartment({
      name: "",
      employees: "",
      status: "Activo",
    });
  };

  const renderDepartmentForm = () => (
    <div className="mt-8 p-6 rounded shadow-lg transition-all duration-300 ease-in-out bg-white">
      <h2 className="text-xl font-bold mb-4 text-blue-600">
        {editingDepartment && editingDepartment.id
          ? "Editar Departamento"
          : "Nuevo Departamento"}
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Nombre
          </label>
          <input
            type="text"
            name="name"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            value={newDepartment.name}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Empleados
          </label>
          <input
            type="number"
            name="employees"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            value={newDepartment.employees}
            onChange={handleChange}
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-500">
            Estado
          </label>
          <select
            name="status"
            className="w-full px-4 py-2 border rounded mt-1 focus:ring-2 focus:ring-blue-500"
            value={newDepartment.status}
            onChange={handleChange}
          >
            <option value="Activo">Activo</option>
            <option value="Inactivo">Inactivo</option>
          </select>
        </div>
        <div className="flex justify-end mt-6 space-x-3">
          <button
            type="button"
            className="flex items-center px-4 py-2 rounded-lg bg-gray-200 text-gray-600"
            onClick={handleCancelEdit}
          >
            <Undo2 size={18} className="mr-2" /> Cancelar
          </button>
          <button
            type="submit"
            className="flex items-center px-4 py-2 rounded-lg bg-blue-600 text-white"
          >
            <Save size={18} className="mr-2" />
            {editingDepartment && editingDepartment.id
              ? "Guardar Cambios"
              : "Agregar Departamento"}
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="min-h-screen p-4 sm:p-6 bg-gray-100 text-gray-900">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-extrabold mb-2 text-blue-600">
          Panel de Administración
        </h1>
        <p className="text-lg mb-8 text-gray-500">
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
          <div className="text-center py-8 text-gray-500">
            Cargando departamentos...
          </div>
        ) : (
          <>
            {renderDepartmentForm()}

            <div className="mt-8 p-6 rounded shadow-lg bg-white">
              <div className="flex justify-between items-center mb-6">
                <div>
                  <h2 className="text-2xl font-bold text-gray-900">
                    Lista de Departamentos
                  </h2>
                  <p className="text-md text-gray-500">
                    Visualiza y gestiona todos los departamentos existentes.
                  </p>
                </div>
                {!editingDepartment && (
                  <button
                    className="flex items-center px-5 py-2 rounded-lg text-white bg-green-500"
                    onClick={() =>
                      setEditingDepartment({
                        id: null,
                        name: "",
                        employees: "",
                        status: "Activo",
                      })
                    }
                  ></button>
                )}
              </div>

              {departments.length === 0 ? (
                <div className="text-center py-4 text-gray-500">
                  No hay departamentos para mostrar. Agrega uno nuevo.
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-4">
                  {departments.map((department) => (
                    <div
                      key={department.id}
                      className="p-6 rounded-lg shadow-md bg-gray-50 hover:scale-[1.02] relative"
                    >
                      <h3 className="text-xl font-bold mb-3 text-blue-600">
                        {department.name}
                      </h3>
                      <div className="space-y-2 text-sm text-gray-500">
                        <div className="flex items-center">
                          <Users size={16} className="mr-2" />
                          <span>
                            Empleados:{" "}
                            <span className="font-semibold text-gray-900">
                              {department.employees}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <Clock size={16} className="mr-2" />
                          <span>
                            Horas Extras (Mes):{" "}
                            <span className="font-semibold text-gray-900">
                              {department.totalExtraHours}
                            </span>
                          </span>
                        </div>
                        <div className="flex items-center">
                          <CircleDotDashed size={16} className="mr-2" />
                          <span>
                            Estado:
                            <span
                              className={`ml-2 px-3 py-1 rounded-full text-xs font-medium ${
                                department.status === "Activo"
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
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
                          className="flex items-center text-blue-500 hover:text-blue-700"
                        >
                          <Edit size={16} className="mr-1" /> Editar
                        </button>
                        <button
                          onClick={() => handleDeleteDepartment(department.id)}
                          className="flex items-center text-red-500 hover:text-red-700"
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
