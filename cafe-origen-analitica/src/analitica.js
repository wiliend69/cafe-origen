const ventas = require("./datos");

function valorVenta(ventas) {
	return ventas.cantidad * ventas.precio;
}

function totalVendido(ventas) {
	let total = 0;
	for (const venta of ventas) {
		if (venta.cantidad > 0) {
			total += valorVenta(venta);
		}
	}
	return total;
}

function unidadesVendidas(ventas) {
	let total = 0;
	for (const venta of ventas) {
		if (venta.cantidad > 0) {
			total += venta.cantidad;
		}
	}
	return total;
}

function ventaMayor(ventas) {
	let mayor = null;
	for (const venta of ventas) {
		if (mayor === null || valorVenta(venta) > valorVenta(mayor)) {
			mayor = venta;
		}
	}
	return mayor;
}

function ticketPromedio(ventas) {
	let total = 0;
	let cantidadVentasValidas = 0;
	for (const venta of ventas) {
		if (venta.cantidad > 0) {
			total += valorVenta(venta);
			cantidadVentasValidas++;
		}
	}
	return cantidadVentasValidas === 0 ? 0 : total / cantidadVentasValidas;
}

function ventasDelDia(ventas, fecha) {
	const ventasValidas = ventas.filter(
		(venta) => venta.fecha === fecha && venta.cantidad > 0
	);
	return {
		fecha,
		cantidadVentas: ventasValidas.length,
		unidadesVendidas: unidadesVendidas(ventasValidas),
		totalVendido: totalVendido(ventasValidas),
		ticketPromedio: ticketPromedio(ventasValidas),
	};
}

function ventasPorCiudad(ventas, ciudad) {
	const ciudadBuscada = normalizarCiudad(ciudad);
	let total = 0;
	for (const venta of ventas) {
		if (
			venta.cantidad > 0 &&
			normalizarCiudad(venta.ciudad) === ciudadBuscada
		) {
			total += valorVenta(venta);
		}
	}
	return total;
}

function normalizarCiudad(ciudad) {
	return ciudad.trim().toLowerCase();
}

function totalVendidoM(ventas) {
	return ventas
		.filter((venta) => venta.cantidad > 0)
		.map((venta) => valorVenta(venta))
		.reduce((total, ingreso) => total + ingreso, 0);
}

function unidadesVendidasM(ventas) {
	return ventas
		.filter((venta) => venta.cantidad > 0)
		.map((venta) => venta.cantidad)
		.reduce((total, cantidad) => total + cantidad, 0);
}

function ventasPorCiudadM(ventas, ciudad) {
	const ciudadBuscada = normalizarCiudad(ciudad);
	return ventas
		.filter(
			(venta) =>
				venta.cantidad > 0 &&
				normalizarCiudad(venta.ciudad) === ciudadBuscada
		)
		.map((venta) => valorVenta(venta))
		.reduce((total, ingreso) => total + ingreso, 0);
}

function totalPorCiudad(ventas) {
	return ventas.reduce((totales, venta) => {
		if (venta.cantidad > 0) {
			const ciudad = normalizarCiudad(venta.ciudad);
			totales[ciudad] = (totales[ciudad] ?? 0) + valorVenta(venta);
		}
		return totales;
	}, {});
}

function unidadesPorProducto(ventas) {
	return ventas.reduce((unidades, venta) => {
		if (venta.cantidad > 0) {
			unidades[venta.producto] =
				(unidades[venta.producto] ?? 0) + venta.cantidad;
		}
		return unidades;
	}, {});
}

function topProductosPorValor(ventas, k) {
	const totales = ventas.reduce((acumulados, venta) => {
		if (venta.cantidad > 0) {
			acumulados[venta.producto] =
				(acumulados[venta.producto] ?? 0) + valorVenta(venta);
		}
		return acumulados;
	}, {});

	return [...Object.entries(totales)]
		.sort(([, totalA], [, totalB]) => totalB - totalA)
		.slice(0, Math.max(0, Math.floor(k)))
		.map(([producto, total]) => ({ producto, total }));
}

if (require.main === module) {
	console.log("Valor de la venta: $", valorVenta(ventas[0]));
	console.log("Total vendido: $", totalVendido(ventas));
	console.log("Unidades vendidas:", unidadesVendidas(ventas));
	console.log("Venta mayor:", ventaMayor(ventas));
	console.log("Ticket promedio: $", ticketPromedio(ventas));
	console.log("Ventas por ciudad (Medellín): $", ventasPorCiudad(ventas, "Medellín"));
	console.log("Top productos por valor:", topProductosPorValor(ventas, 3));
}

module.exports = {
	valorVenta,
	totalVendido,
	unidadesVendidas,
	ventaMayor,
	ticketPromedio,
	ventasDelDia,
	ventasPorCiudad,
	totalVendidoM,
	unidadesVendidasM,
	ventasPorCiudadM,
	totalPorCiudad,
	unidadesPorProducto,
	topProductosPorValor,
};


