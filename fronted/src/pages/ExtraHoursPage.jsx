import React from "react";
import ExtraHoursList from "./ExtraHoursList";

const ExtraHoursPage = () => {
  return (
    <div style={{ padding: "20px", fontFamily: "Arial, sans-serif" }}>
      <h1>Gestión de Horas Extras</h1>
      <p>
        Esta es una página dedicada a la prueba de la funcionalidad de horas
        extras.
      </p>
      <ExtraHoursList />
    </div>
  );
};

export default ExtraHoursPage;
