const { isDeepStrictEqual } = require("node:util");
const ventas = require("./datos");

function totalVendidoConCiclo(datosVentas) {
	let total = 0;

	for (const venta of datosVentas) {
		total += venta.cantidad * venta.precio;
	}

	return total;
}

function unidadesVendidasConCiclo(datosVentas) {
	let unidades = 0;

	for (const venta of datosVentas) {
		unidades += venta.cantidad;
	}

	return unidades;
}

function ventasPorCiudadConCiclo(datosVentas) {
	const conteo = {};

	for (const venta of datosVentas) {
		const ciudad = venta.ciudad.trim().toLowerCase();
		conteo[ciudad] = (conteo[ciudad] || 0) + 1;
	}

	return conteo;
}

const indicadores = [
	{
		nombre: "Total vendido",
		conCiclo: totalVendidoConCiclo(ventas),
		conMetodos: ventas.reduce(
			(total, venta) => total + venta.cantidad * venta.precio,
			0
		),
	},
	{
		nombre: "Unidades vendidas",
		conCiclo: unidadesVendidasConCiclo(ventas),
		conMetodos: ventas.reduce((total, venta) => total + venta.cantidad, 0),
	},
	{
		nombre: "Ventas por ciudad",
		conCiclo: ventasPorCiudadConCiclo(ventas),
		conMetodos: ventas.reduce((conteo, venta) => {
			const ciudad = venta.ciudad.trim().toLowerCase();
			conteo[ciudad] = (conteo[ciudad] || 0) + 1;
			return conteo;
		}, {}),
	},
];

for (const indicador of indicadores) {
	const estado = isDeepStrictEqual(indicador.conCiclo, indicador.conMetodos)
		? "OK"
		: "DIFERENTE";

	console.log(`${indicador.nombre}: ${estado}`);

	if (estado === "DIFERENTE") {
		process.exitCode = 1;
	}
}
