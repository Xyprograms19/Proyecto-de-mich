import React, { useEffect, useState } from "react";
import extraHourTypeService from "../services/extraHourTypeService";

const TestExtraHours = () => {
  const [extraHours, setExtraHours] = useState([]);

  useEffect(() => {
    fetchExtraHours();
  }, []);

  const fetchExtraHours = async () => {
    try {
      const response = await extraHourTypeService.getExtraHourTypes();
      setExtraHours(response.data);
    } catch (error) {
      console.error("Error al obtener horas extras:", error);
    }
  };

  return (
    <div>
      <h1>Prueba de Horas Extras</h1>
      <ul>
        {extraHours.map((hour) => (
          <li key={hour.id}>
            {hour.type} - Multiplicador: {hour.multiplier}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TestExtraHours;
