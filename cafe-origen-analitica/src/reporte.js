const ventas = require("./datos");
const {
	ventaMayor,
	ticketPromedio,
	ventasDelDia,
	totalVendido,
	unidadesVendidas,
	unidadesPorProducto,
	totalPorCiudad,
	topProductosPorValor,
} = require("./analitica");

const anchoReporte = 76;

function formatoPesos(valor) {
	return `$ ${valor.toLocaleString("es-CO", {
		minimumFractionDigits: 0,
		maximumFractionDigits: 2,
	})}`;
}

function imprimirSeccion(titulo) {
	console.log(`\n${titulo.toUpperCase()}`);
	console.log("-".repeat(titulo.length));
}

function nombreCiudad(ciudadNormalizada) {
	return ciudadNormalizada
		.split(" ")
		.map(
			(palabra) =>
				palabra.charAt(0).toLocaleUpperCase("es-CO") + palabra.slice(1)
		)
		.join(" ");
}

const mayorVenta = ventaMayor(ventas);
const cantidadVentasValidas = ventas.filter((venta) => venta.cantidad > 0).length;
const diasDelReporte = ["2026-09-01", "2026-09-07"].map((fecha) =>
	ventasDelDia(ventas, fecha)
);

console.log("=".repeat(anchoReporte));
console.log("CAFÉ ORIGEN | REPORTE DE VENTAS".padStart(53).padEnd(anchoReporte));
console.log("=".repeat(anchoReporte));

imprimirSeccion("Resumen general");
console.log(`  ${"Ventas válidas".padEnd(28)} ${cantidadVentasValidas.toLocaleString("es-CO")}`);
console.log(
	`  ${"Unidades vendidas".padEnd(28)} ${unidadesVendidas(ventas).toLocaleString("es-CO")}`
);
console.log(`  ${"Total vendido".padEnd(28)} ${formatoPesos(totalVendido(ventas))}`);
console.log(`  ${"Ticket promedio".padEnd(28)} ${formatoPesos(ticketPromedio(ventas))}`);
console.log(
	`  ${"Venta de mayor valor".padEnd(28)} ${mayorVenta ? `${mayorVenta.producto} (${formatoPesos(mayorVenta.cantidad * mayorVenta.precio)})` : "Sin ventas"}`
);

imprimirSeccion("Ventas por ciudad");
console.table(
	Object.entries(totalPorCiudad(ventas)).map(([ciudad, total]) => ({
		Ciudad: nombreCiudad(ciudad),
		"Total vendido": formatoPesos(total),
	}))
);

imprimirSeccion("Unidades por producto");
console.table(
	Object.entries(unidadesPorProducto(ventas)).map(([producto, unidades]) => ({
		Producto: producto,
		Unidades: unidades.toLocaleString("es-CO"),
	}))
);

imprimirSeccion("Top 3 productos por valor");
console.table(
	topProductosPorValor(ventas, 3).map(({ producto, total }, indice) => ({
		Posición: indice + 1,
		Producto: producto,
		Valor: formatoPesos(total),
	}))
);

imprimirSeccion("Resumen diario");
console.table(
	diasDelReporte.map((dia) => ({
		Fecha: dia.fecha,
		Ventas: dia.cantidadVentas.toLocaleString("es-CO"),
		Unidades: dia.unidadesVendidas.toLocaleString("es-CO"),
		Total: formatoPesos(dia.totalVendido),
		"Ticket promedio": formatoPesos(dia.ticketPromedio),
	}))
);

console.log("=".repeat(anchoReporte));