const ventas = require("./datos");
const {
	totalVendido,
	unidadesVendidas,
	ventasPorCiudad,
	totalVendidoM,
	unidadesVendidasM,
	ventasPorCiudadM,
} = require("./analitica");

const ciudad = "  MEDELLÍN ";
const comparaciones = [
	["Total vendido", totalVendido(ventas), totalVendidoM(ventas)],
	["Unidades vendidas", unidadesVendidas(ventas), unidadesVendidasM(ventas)],
	[
		`Ventas por ciudad (${ciudad.trim()})`,
		ventasPorCiudad(ventas, ciudad),
		ventasPorCiudadM(ventas, ciudad),
	],
];

for (const [nombre, resultadoCiclo, resultadoMetodos] of comparaciones) {
	const estado = Object.is(resultadoCiclo, resultadoMetodos) ? "OK" : "DIFERENTE";
	console.log(`${nombre}: ${estado}`);
	if (estado === "DIFERENTE") {
		console.log(`  ciclo=${resultadoCiclo}, métodos=${resultadoMetodos}`);
		process.exitCode = 1;
	}
}