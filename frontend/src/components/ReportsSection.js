import React, { useState, useEffect } from "react";
import apiService from "../services/apiService";
import salesService from "../services/salesService";

function ReportsSection() {
  const [salesData, setSalesData] = useState(null);
  const [analyticsData, setAnalyticsData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchReportsData = async () => {
      try {
        setLoading(true);

        const salesStats = await salesService.getSalesStats();

        setSalesData({
          ventasTotales: salesStats.totalSales,
          ingresosTotales: salesStats.totalRevenue,
          productosMasVendidos: salesStats.recentSales.map((sale) => {
            const nombreProducto = sale.items?.[0]?.name || "Producto";
            const cantidadVendida =
              sale.items?.reduce((sum, item) => sum + item.quantity, 0) || 0;
            const ingresos =
              sale.items?.reduce(
                (sum, item) => sum + item.quantity * item.price,
                0
              ) || 0;

            return {
              _id: sale.id,
              nombreProducto,
              cantidadVendida,
              ingresos,
            };
          }),
          ventasPorMetodoPago: salesStats.ventasPorMetodoPago || [],
        });

        try {
          const analytics = await apiService.getReports();
          setAnalyticsData(analytics);
        } catch (error) {
          console.log("Analytics API not available, using default data");
          setAnalyticsData({
            crecimientoVentas: 15.5,
            clientesNuevos: 25,
            satisfaccionCliente: 4.8,
          });
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
        setError("Error al cargar los reportes");
      } finally {
        setLoading(false);
      }
    };

    fetchReportsData();
  }, []);

  if (loading) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Reportes y Análisis
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Cargando reportes...</p>
        </div>
      </section>
    );
  }

  if (error) {
    return (
      <section className="container mx-auto px-4 py-12">
        <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
          Reportes y Análisis
        </h2>
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-3xl mx-auto text-center">
          <p className="text-red-600">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-4xl font-bold text-center text-gray-900 mb-10">
        Reportes y Análisis
      </h2>

      <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Información de Ventas
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-blue-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-blue-900 mb-2">
              Ventas Totales
            </h4>
            <p className="text-3xl font-bold text-blue-600">
              {salesData?.ventasTotales || 0}
            </p>
          </div>
          <div className="bg-green-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-green-900 mb-2">
              Ingresos Totales
            </h4>
            <p className="text-3xl font-bold text-green-600">
              ${(salesData?.ingresosTotales || 0).toFixed(2)}
            </p>
          </div>
          <div className="bg-purple-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-purple-900 mb-2">
              Promedio por Venta
            </h4>
            <p className="text-3xl font-bold text-purple-600">
              $
              {salesData?.ventasTotales > 0
                ? (salesData.ingresosTotales / salesData.ventasTotales).toFixed(
                    2
                  )
                : "0.00"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Productos Más Vendidos
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            {salesData?.productosMasVendidos?.length > 0 ? (
              <div className="space-y-3">
                {salesData.productosMasVendidos.map((producto, index) => (
                  <div
                    key={producto._id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-500 mr-3">
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {producto.nombreProducto}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Cantidad: {producto.cantidadVendida}
                      </p>
                      <p className="font-semibold text-green-600">
                        $
                        {producto.ingresos != null
                          ? producto.ingresos.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No hay datos de productos vendidos
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Ventas por Método de Pago
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            {salesData?.ventasPorMetodoPago?.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {salesData.ventasPorMetodoPago.map((metodo) => (
                  <div
                    key={metodo._id}
                    className="bg-white rounded-lg p-4 text-center"
                  >
                    <h5 className="font-semibold text-gray-900 capitalize">
                      {metodo._id}
                    </h5>
                    <p className="text-2xl font-bold text-blue-600">
                      {metodo.cantidad}
                    </p>
                    <p className="text-sm text-gray-600">
                      ${metodo.total != null ? metodo.total.toFixed(2) : "0.00"}
                    </p>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No hay datos de métodos de pago
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-lg p-8">
        <h3 className="text-2xl font-bold text-gray-900 mb-6">
          Análisis General de la Plataforma
        </h3>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-orange-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-orange-900 mb-2">
              Total de Productos
            </h4>
            <p className="text-3xl font-bold text-orange-600">
              {analyticsData?.totalProductos || 0}
            </p>
          </div>
          <div className="bg-red-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-red-900 mb-2">
              Total de Ventas
            </h4>
            <p className="text-3xl font-bold text-red-600">
              {analyticsData?.metricasRendimiento?.totalVentas || 0}
            </p>
          </div>
          <div className="bg-indigo-50 rounded-lg p-6 text-center">
            <h4 className="text-lg font-semibold text-indigo-900 mb-2">
              Promedio Ticket
            </h4>
            <p className="text-3xl font-bold text-indigo-600">
              $
              {analyticsData?.metricasRendimiento?.promedioTicket != null
                ? analyticsData.metricasRendimiento.promedioTicket.toFixed(2)
                : "0.00"}
            </p>
          </div>
        </div>

        <div className="mb-8">
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Clientes Más Activos
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            {analyticsData?.clientesMasActivos?.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.clientesMasActivos.map((cliente, index) => (
                  <div
                    key={cliente._id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <div className="flex items-center">
                      <span className="text-lg font-bold text-gray-500 mr-3">
                        #{index + 1}
                      </span>
                      <span className="font-semibold text-gray-900">
                        {cliente._id}
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        Compras: {cliente.compras}
                      </p>
                      <p className="font-semibold text-green-600">
                        $
                        {cliente.totalGastado != null
                          ? cliente.totalGastado.toFixed(2)
                          : "0.00"}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                No hay datos de clientes
              </p>
            )}
          </div>
        </div>

        <div>
          <h4 className="text-xl font-semibold text-gray-900 mb-4">
            Productos con Bajo Rendimiento
          </h4>
          <div className="bg-gray-50 rounded-lg p-6">
            {analyticsData?.productosStockBajo?.length > 0 ? (
              <div className="space-y-3">
                {analyticsData.productosStockBajo.map((producto) => (
                  <div
                    key={producto._id}
                    className="flex justify-between items-center p-3 bg-white rounded-lg shadow-sm"
                  >
                    <span className="font-semibold text-gray-900">
                      {producto.nombreProducto}
                    </span>
                    <div className="text-right">
                      <p className="text-sm text-red-600">
                        Solo {producto.ventasUltimoMes} ventas este mes
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500 text-center">
                Todos los productos tienen buen rendimiento
              </p>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default ReportsSection;
