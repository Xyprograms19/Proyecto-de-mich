import React, { useState } from "react";

const AddExtraHourForm = ({ onAdd }) => {
  const [formData, setFormData] = useState({
    userId: "",
    date: "",
    startTime: "",
    endTime: "",
    reason: "",
    status: "Pendiente",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.userId ||
      !formData.date ||
      !formData.startTime ||
      !formData.endTime ||
      !formData.reason
    ) {
      setError("Por favor, complete todos los campos");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5023/api/extrahours", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });

      if (response.ok) {
        const newHour = await response.json();
        onAdd(newHour);
        setFormData({
          userId: "",
          date: "",
          startTime: "",
          endTime: "",
          reason: "",
          status: "Pendiente",
        });
      } else {
        setError("Error al agregar la hora extra");
      }
    } catch (err) {
      setError("Error de conexión" + err.message);
    }
    setLoading(false);
  };

  return (
    <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded shadow-sm">
      <h2 className="text-xl font-semibold mb-4">Agregar Hora Extra</h2>

      {error && <p className="text-red-600 mb-2">{error}</p>}

      <div className="mb-2">
        <label className="block mb-1 font-medium">Usuario (ID):</label>
        <input
          type="text"
          name="userId"
          value={formData.userId}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium">Fecha:</label>
        <input
          type="date"
          name="date"
          value={formData.date}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium">Hora de inicio:</label>
        <input
          type="time"
          name="startTime"
          value={formData.startTime}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium">Hora de fin:</label>
        <input
          type="time"
          name="endTime"
          value={formData.endTime}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-2">
        <label className="block mb-1 font-medium">Razón:</label>
        <input
          type="text"
          name="reason"
          value={formData.reason}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
          required
        />
      </div>

      <div className="mb-4">
        <label className="block mb-1 font-medium">Estado:</label>
        <select
          name="status"
          value={formData.status}
          onChange={handleChange}
          className="w-full border px-2 py-1 rounded"
        >
          <option value="Pendiente">Pendiente</option>
          <option value="Aprobada">Aprobada</option>
          <option value="Rechazada">Rechazada</option>
        </select>
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        {loading ? "Agregando..." : "Agregar Hora Extra"}
      </button>
    </form>
  );
};

export default AddExtraHourForm;
