import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { CheckCircle, XCircle, FileText, StickyNote } from "lucide-react";

const Requests = () => {
  const [filter, setFilter] = useState("Todos los estados");
  const [extraHourType, setExtraHourType] = useState("");
  const [notes, setNotes] = useState({});
  const [selectedRequest, setSelectedRequest] = useState(null);
  const [noteInput, setNoteInput] = useState("");
  const [isEditingNote, setIsEditingNote] = useState(false);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchRequests();
  }, [filter, extraHourType, startDate, endDate, currentPage]);

  const fetchRequests = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("http://localhost:5023/api/extrahours");
      if (!res.ok) {
        throw new Error(`Error HTTP: ${res.status} ${res.statusText}`);
      }
      const data = await res.json();
      setRequests(data);
    } catch (err) {
      setError("Error al cargar las solicitudes: " + err.message);
      console.error("Error fetching requests:", err);
    } finally {
      setLoading(false);
    }
  };

  const filteredRequests = requests.filter((request) => {
    const requestDate = new Date(request.date);
    const filterStartDate = startDate ? new Date(startDate) : null;
    const filterEndDate = endDate ? new Date(endDate) : null;

    const isWithinDateRange =
      (!filterStartDate || requestDate >= filterStartDate) &&
      (!filterEndDate || requestDate <= filterEndDate);

    if (!isWithinDateRange) return false;

    if (filter === "Todos los estados") return true;
    if (filter === "Pendiente" && request.status === "Pendiente") return true;
    if (filter === "Aprobado" && request.status === "Aprobado") return true;
    if (filter === "Rechazado" && request.status === "Rechazado") return true;

    if (
      filter === "Tipo de Hora" &&
      extraHourType &&
      request.reason === extraHourType
    )
      return true;

    return false;
  });

  const totalPages = Math.ceil(filteredRequests.length / itemsPerPage);
  const paginatedRequests = filteredRequests.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const handleAddNote = (request) => {
    setSelectedRequest(request);
    setNoteInput(request.rejectionReason || notes[request.id] || "");
    setIsEditingNote(
      request.status === "Pendiente" || request.status === "Rechazado"
    );
  };

  const handleSaveNote = async () => {
    if (!selectedRequest) return;

    const updatedRequest = {
      ...selectedRequest,
      rejectionReason: noteInput,
    };

    try {
      const res = await fetch(
        `http://localhost:5023/api/extrahours/${selectedRequest.id}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(updatedRequest),
        }
      );

      if (res.ok) {
        setRequests((prev) =>
          prev.map((req) =>
            req.id === selectedRequest.id ? updatedRequest : req
          )
        );
        setNotes({ ...notes, [selectedRequest.id]: noteInput });
        setSelectedRequest(null);
        setIsEditingNote(false);
        fetchRequests();
      } else {
        const errorData = await res.json();
        alert(
          "Error al guardar la nota: " + (errorData.message || res.statusText)
        );
      }
    } catch (err) {
      alert("Error de conexión al guardar la nota: " + err.message);
      console.error("Error saving note:", err);
    }
  };

  const handleCloseNote = () => {
    setSelectedRequest(null);
    setIsEditingNote(false);
  };

  const handleEditNote = () => {
    setIsEditingNote(true);
  };

  const updateRequestStatus = async (id, newStatus) => {
    const requestToUpdate = requests.find((req) => req.id === id);
    if (!requestToUpdate) {
      alert("Solicitud no encontrada.");
      return;
    }

    const updatedRequest = {
      ...requestToUpdate,
      status: newStatus,
      rejectionReason:
        newStatus === "Aprobado" ? null : requestToUpdate.rejectionReason,
    };

    try {
      const res = await fetch(`http://localhost:5023/api/extrahours/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(updatedRequest),
      });

      if (res.ok) {
        fetchRequests();
      } else {
        const errorData = await res.json();
        alert(
          `Error al ${
            newStatus === "Aprobado" ? "aprobar" : "rechazar"
          } la solicitud: ` + (errorData.message || res.statusText)
        );
      }
    } catch (err) {
      alert("Error de conexión: " + err.message);
      console.error("Error updating request status:", err);
    }
  };

  const handleApprove = (id) => updateRequestStatus(id, "Aprobado");
  const handleReject = (id) => updateRequestStatus(id, "Rechazado");

  const handleStatusChange = (e) => {
    const newStatus = e.target.value;
    setSelectedRequest((prev) => ({ ...prev, status: newStatus }));
    if (newStatus !== "Rechazado") {
      setNoteInput("");
    }
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  if (loading) {
    return <div className="text-center py-8">Cargando solicitudes...</div>;
  }

  if (error) {
    return <div className="text-center py-8 text-red-600">Error: {error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mb-4">
            <CardTitle>Gestión de Solicitudes</CardTitle>
            <div className="flex flex-col md:flex-row md:items-center md:space-x-2 mt-2 md:mt-0">
              <select
                className="border border-gray-300 rounded p-2 mb-2 md:mb-0 bg-white text-gray-900"
                value={filter}
                onChange={(e) => {
                  setFilter(e.target.value);
                  setExtraHourType("");
                }}
              >
                <option>Todos los estados</option>
                <option value="Pendiente">Pendiente</option>
                <option value="Aprobado">Aprobado</option>
                <option value="Rechazado">Rechazado</option>
                <option value="Tipo de Hora">Tipo de Hora</option>
              </select>
              {filter === "Tipo de Hora" && (
                <select
                  className="border border-gray-300 rounded p-2 mb-2 md:mb-0 bg-white text-gray-900"
                  value={extraHourType}
                  onChange={(e) => setExtraHourType(e.target.value)}
                >
                  <option value="">Selecciona un tipo</option>
                  <option value="Extra Diurna">Extra Diurna</option>
                  <option value="Extra Nocturna">Extra Nocturna</option>
                  <option value="Dominical/Festivo">Dominical/Festivo</option>
                </select>
              )}
              <input
                type="date"
                className="border border-gray-300 rounded p-2 mb-2 md:mb-0 bg-white text-gray-900"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
              <input
                type="date"
                className="border border-gray-300 rounded p-2 bg-white text-gray-900"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>
          </div>
          <CardDescription>
            Aprueba o rechaza solicitudes de horas extras
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead>
                <tr>
                  <th className="py-2 px-4 border-b text-left">ID</th>
                  <th className="py-2 px-4 border-b text-left">Usuario ID</th>
                  <th className="py-2 px-4 border-b text-left">Fecha</th>
                  <th className="py-2 px-4 border-b text-left">Hora Inicio</th>
                  <th className="py-2 px-4 border-b text-left">Hora Fin</th>
                  <th className="py-2 px-4 border-b text-left">Razón/Tipo</th>
                  <th className="py-2 px-4 border-b text-left">Estado</th>
                  <th className="py-2 px-4 border-b text-left">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {paginatedRequests.map((request) => (
                  <tr key={request.id} className="border-b hover:bg-gray-50">
                    <td className="py-2 px-4 border-b">{request.id}</td>
                    <td className="py-2 px-4 border-b">{request.userId}</td>
                    <td className="py-2 px-4 border-b">
                      {new Date(request.date).toLocaleDateString()}
                    </td>
                    <td className="py-2 px-4 border-b">{request.startTime}</td>
                    <td className="py-2 px-4 border-b">{request.endTime}</td>
                    <td className="py-2 px-4 border-b">{request.reason}</td>
                    <td className="py-2 px-4 border-b">
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
                    <td className="py-2 px-4 border-b">
                      <div className="flex space-x-2">
                        {request.status === "Pendiente" && (
                          <>
                            <button
                              className="text-green-500 hover:text-green-700 p-1 rounded hover:bg-green-100 transition-colors"
                              onClick={() => handleApprove(request.id)}
                              title="Aprobar"
                            >
                              <CheckCircle size={20} />
                            </button>
                            <button
                              className="text-red-500 hover:text-red-700 p-1 rounded hover:bg-red-100 transition-colors"
                              onClick={() => handleReject(request.id)}
                              title="Rechazar"
                            >
                              <XCircle size={20} />
                            </button>
                            <button
                              className="text-gray-500 hover:text-gray-700 p-1 rounded hover:bg-gray-100 transition-colors"
                              onClick={() => handleAddNote(request)}
                              title="Agregar Nota"
                            >
                              <StickyNote size={20} />
                            </button>
                          </>
                        )}
                        {request.status !== "Pendiente" && (
                          <button
                            className="text-blue-500 hover:text-blue-700 p-1 rounded hover:bg-blue-100 transition-colors"
                            onClick={() => handleAddNote(request)}
                            title="Ver Detalles / Razón de Rechazo"
                          >
                            <FileText size={20} />
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <div className="flex justify-between items-center mt-4">
            <p className="text-gray-600">
              Mostrando {paginatedRequests.length} de {filteredRequests.length}{" "}
              solicitudes
            </p>
            <div className="flex space-x-2">
              {Array.from({ length: totalPages }, (_, index) => (
                <button
                  key={index + 1}
                  className={`px-3 py-1 rounded ${
                    currentPage === index + 1
                      ? "bg-blue-500 text-white"
                      : "bg-gray-200 text-gray-800"
                  }`}
                  onClick={() => handlePageChange(index + 1)}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>
        </CardContent>
      </Card>

      {selectedRequest && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-11/12 md:w-1/2">
            {/* Título del modal */}
            <h2 className="text-xl font-semibold mb-4 text-gray-900">
              {" "}
              {/* AGREGADO: text-gray-900 */}
              {selectedRequest.status === "Pendiente" || isEditingNote
                ? "Agregar/Editar Detalles"
                : "Detalles de la Solicitud"}
            </h2>
            {/* Detalles de la solicitud */}
            <div className="mb-4">
              <p className="text-gray-900">
                <strong>Usuario:</strong> {selectedRequest.userId}
              </p>{" "}
              {/* AGREGADO: text-gray-900 */}
              <p className="text-gray-900">
                <strong>Fecha:</strong>{" "}
                {new Date(selectedRequest.date).toLocaleDateString()}
              </p>{" "}
              {/* AGREGADO: text-gray-900 */}
              <p className="text-gray-900">
                <strong>Tipo:</strong> {selectedRequest.reason}
              </p>{" "}
              {/* AGREGADO: text-gray-900 */}
              <p className="text-gray-900">
                <strong>Estado Actual:</strong> {/* AGREGADO: text-gray-900 */}
                <span
                  className={`px-2 py-1 rounded-full text-xs ml-2 ${
                    selectedRequest.status === "Aprobado"
                      ? "bg-green-100 text-green-800"
                      : selectedRequest.status === "Rechazado"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {selectedRequest.status}
                </span>
              </p>
            </div>

            {isEditingNote || selectedRequest.status === "Rechazado" ? (
              <>
                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="note"
                  >
                    Razón/Nota:
                  </label>
                  <textarea
                    id="note"
                    className="w-full border border-gray-300 rounded p-2 mb-2 bg-white text-gray-900"
                    rows="4"
                    value={noteInput}
                    onChange={(e) => setNoteInput(e.target.value)}
                    placeholder="Escribe una razón para rechazar o una nota adicional..."
                  ></textarea>
                </div>

                <div className="mb-4">
                  <label
                    className="block text-gray-700 text-sm font-bold mb-2"
                    htmlFor="status-change"
                  >
                    Cambiar Estado:
                  </label>
                  <select
                    id="status-change"
                    className="w-full border border-gray-300 rounded p-2 bg-white text-gray-900"
                    value={selectedRequest.status}
                    onChange={handleStatusChange}
                  >
                    <option value="Pendiente">Pendiente</option>
                    <option value="Aprobado">Aprobado</option>
                    <option value="Rechazado">Rechazado</option>
                  </select>
                </div>

                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={handleCloseNote}
                  >
                    Cancelar
                  </button>
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                    onClick={handleSaveNote}
                  >
                    Guardar Cambios
                  </button>
                </div>
              </>
            ) : (
              <>
                <div className="mb-4">
                  <label className="block text-gray-700 text-sm font-bold mb-2">
                    Nota (si aplica):
                  </label>
                  <p className="border border-gray-200 bg-gray-50 p-2 rounded min-h-[80px] text-gray-900">
                    {" "}
                    {/* AGREGADO: text-gray-900 */}
                    {selectedRequest.rejectionReason ||
                      "No hay notas para esta solicitud."}
                  </p>
                </div>
                <div className="flex justify-end space-x-2">
                  <button
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600 transition-colors"
                    onClick={handleCloseNote}
                  >
                    Cerrar
                  </button>
                  {(selectedRequest.status === "Pendiente" ||
                    selectedRequest.status === "Rechazado") && (
                    <button
                      className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors"
                      onClick={handleEditNote}
                    >
                      Editar Nota
                    </button>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Requests;
