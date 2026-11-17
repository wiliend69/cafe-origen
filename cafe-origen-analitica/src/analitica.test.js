const test = require("node:test");
const assert = require("node:assert/strict");
const ventas = require("./datos");
const {
	totalVendido,
	unidadesVendidas,
	ventaMayor,
	ticketPromedio,
	ventasPorCiudad,
	totalVendidoM,
	unidadesVendidasM,
	ventasPorCiudadM,
	totalPorCiudad,
	unidadesPorProducto,
	topProductosPorValor,
} = require("./analitica");

test("totalVendido funciona con arreglo completo, unitario y vacío", () => {
	assert.equal(totalVendido(ventas), 985000);
	assert.equal(totalVendido([ventas[0]]), 84000);
	assert.equal(totalVendido([]), 0);
});

test("unidadesVendidas funciona con arreglo completo, unitario y vacío", () => {
	assert.equal(unidadesVendidas(ventas), 21);
	assert.equal(unidadesVendidas([ventas[0]]), 2);
	assert.equal(unidadesVendidas([]), 0);
});

test("ventaMayor devuelve el registro completo o null si está vacío", () => {
	assert.deepEqual(ventaMayor(ventas), ventas[9]);
	assert.deepEqual(ventaMayor([ventas[0]]), ventas[0]);
	assert.equal(ventaMayor([]), null);
});

test("ticketPromedio cuenta solo ventas con cantidad mayor que cero", () => {
	assert.equal(ticketPromedio(ventas), 985000 / 11);
	assert.equal(ticketPromedio([ventas[0]]), 84000);
	assert.equal(ticketPromedio([]), 0);
});

test("ventasPorCiudad normaliza mayúsculas y espacios sobrantes", () => {
	assert.equal(ventasPorCiudad(ventas, "  MEDELLÍN "), 356000);
	assert.equal(ventasPorCiudad([ventas[0]], " medellín "), 84000);
	assert.equal(ventasPorCiudad([], "Medellín"), 0);
});

test("las versiones con métodos coinciden con los ciclos", () => {
	assert.equal(totalVendidoM(ventas), totalVendido(ventas));
	assert.equal(unidadesVendidasM(ventas), unidadesVendidas(ventas));
	assert.equal(
		ventasPorCiudadM(ventas, "  MEDELLÍN "),
		ventasPorCiudad(ventas, "  MEDELLÍN ")
	);
});

test("totalPorCiudad agrupa ciudades normalizadas", () => {
	assert.deepEqual(totalPorCiudad(ventas), {
		medellín: 356000,
		bogotá: 276000,
		cali: 185000,
		pereira: 168000,
	});
	assert.deepEqual(totalPorCiudad([ventas[1]]), { bogotá: 26000 });
	assert.deepEqual(totalPorCiudad([]), {});
	assert.deepEqual(
		totalPorCiudad([ventas[1], { ...ventas[1], ciudad: "Bogotá " }]),
		{ bogotá: 52000 }
	);
});

test("unidadesPorProducto acumula cantidades por producto", () => {
	assert.deepEqual(unidadesPorProducto(ventas), {
		"Origen Huila 500 g": 7,
		"Origen Nariño 250 g": 6,
		"Prensa francesa": 2,
		"Origen Sierra 500 g": 5,
		"Molino manual": 1,
	});
	assert.deepEqual(unidadesPorProducto([ventas[0]]), {
		"Origen Huila 500 g": 2,
	});
	assert.deepEqual(unidadesPorProducto([]), {});
});

test("topProductosPorValor ordena sin modificar las ventas", () => {
	const ventasOriginales = [...ventas];
	assert.deepEqual(topProductosPorValor(ventas, 3), [
		{ producto: "Origen Huila 500 g", total: 294000 },
		{ producto: "Origen Sierra 500 g", total: 225000 },
		{ producto: "Prensa francesa", total: 190000 },
	]);
	assert.deepEqual(ventas, ventasOriginales);
	assert.deepEqual(topProductosPorValor([ventas[0]], 1), [
		{ producto: "Origen Huila 500 g", total: 84000 },
	]);
	assert.deepEqual(topProductosPorValor([], 3), []);
});