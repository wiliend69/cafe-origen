const ventas = require("./datos");
const {
    valorVenta,
    totalVendido,
    unidadesVendidas,
    ventasMayor,
    ticketPromedio,
    ventasPorCiudad,
    totalPorCiudad,
    unidadesPorProducto,
    productosOrdenados,
} = require("./analitica"); 



console.log("==============================================================");
console.log("         REPORTE DE ANALÍTICA - CAFÉ ORIGEN v0.1              ");
console.log("==============================================================\n");


// ----------------------------------------------------------------------------
// 1. EXPLORACIÓN INICIAL DE DATOS (Minirreto 1)
// ----------------------------------------------------------------------------
console.log("--- 1. EXPLORACIÓN DE LA MUESTRA (Minirreto 1) ---");
console.log("Cantidad de registros:", ventas.length);
console.log("Primer registro      :", ventas[0]);
console.log("Último registro      :", ventas.at(-1));
console.log();

// ----------------------------------------------------------------------------
// 2. INDICADORES CON CICLOS FOR...OF (Minirreto 2)
// ----------------------------------------------------------------------------
console.log("--- 2. INDICADORES CON CICLOS (Minirreto 2) ---");
console.log("Valor primera venta  :", valorVenta(ventas[0]));
console.log("Total vendido        :", totalVendido(ventas));
console.log("Unidades vendidas    :", unidadesVendidas(ventas));
console.log("Venta mayor          :", ventasMayor(ventas));
console.log("ventas en medellin:", ventasPorCiudad(ventas, "Medellín"));
console.log("promedio venta:", ticketPromedio(ventas));

// ----------------------------------------------------------------------------
// 3. AGRUPACIONES Y RANKINGS CON MÉTODOS DE ARREGLO (Minirreto 3)
// ----------------------------------------------------------------------------
console.log("--- 3. AGRUPACIONES Y TOP K CON MÉTODOS (Minirreto 3) ---");
console.log("Ventas por ciudad:", ventasPorCiudad(ventas));
console.log("Total vendido por ciudad:", totalPorCiudad(ventas));
console.log("Unidades vendidas por producto:", unidadesPorProducto);
console.log("Top 3 productos con mayor valor de venta:", productosOrdenados.slice(0, 3));

// ----------------------------------------------------------------------------
// 4. VERIFICACIÓN DE INMUTABILIDAD (Minirreto 4)
// ----------------------------------------------------------------------------
console.log("--- 4. VERIFICACIÓN DEL ARREGLO ORIGINAL (Minirreto 4) ---");
console.log("¿Sigue teniendo 12 registros? :", ventas.length === 12);
console.log("¿El primero sigue siendo ID 1?:", ventas[0].id === 1);
console.log("==============================================================");