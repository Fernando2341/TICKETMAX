import './EventReport.module.css';
import SideMenuA from './SideMenuA';
const EventReport = () => {

  return (
    <div className="event-report-container flex">
      {/* Sidebar */}
        <SideMenuA />
      {/* Main Content */}
      <main className="main-content">
        {/* Reporte Global */}
        <div className="report-header">
          <h1>Reporte Global</h1>
          <div className="event-selection">
            <label htmlFor="event">Evento:</label>
            <select id="event">
              <option>Selecciona el evento</option>
            </select>
          </div>
        </div>

        {/* Informe */}
        <div className="report-info">
          <div>
            <h2>Informe</h2>
            <div className="summary-table">
              <table>
                <thead>
                  <tr>
                    <th>Evento</th>
                    <th>Aforado (vendido/total)</th>
                    <th>Costos</th>
                    <th>Descuentos</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Los Santos Culpables - Monterrey</td>
                    <td>72 / 72</td>
                    <td>$7,200.00</td>
                    <td>$0.00</td>
                    <td>$7,200.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Detalles */}
          <div className="report-details">
            <h2>Detalles</h2>

            {/* Descuentos */}
            <div className="discounts-section">
              <h3>Descuentos</h3>
              <table>
                <thead>
                  <tr>
                    <th>Descuentos por promoción</th>
                    <th>Descuentos por código</th>
                    <th>Total de Descuentos</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>$0.00</td>
                    <td>$0.00</td>
                    <td>$0.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Modo de Venta */}
            <div className="sales-mode-section">
              <h3>Modo de Venta</h3>
              <table>
                <thead>
                  <tr>
                    <th>Página Web</th>
                    <th>Punto de Venta</th>
                    <th>Call Center</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>
                      Vendidos: 71<br />
                      Total: $7,100.00
                    </td>
                    <td>
                      Vendidos: 1<br />
                      Total: $100.00
                    </td>
                    <td>
                      Vendidos: 0<br />
                      Total: $0.00
                    </td>
                    <td>$7,200.00</td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Asistencia */}
            <div className="attendance-section">
              <h3>Asistencia</h3>
              <table>
                <thead>
                  <tr>
                    <th>Total Aforado</th>
                    <th>Total de Boletos Vendidos</th>
                    <th>Cortesías</th>
                    <th>Total</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>72</td>
                    <td>72</td>
                    <td>0</td>
                    <td>$7,200.00</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Botón para Descargar */}
        <div className="download-section">
          <button className="download-button">Descargar</button>
        </div>
      </main>
    </div>
  );
};

export default EventReport;
