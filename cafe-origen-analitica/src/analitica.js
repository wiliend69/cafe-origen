const ventas = require("./datos");

function valorVenta(ventas) {
	return ventas.cantidad * ventas.precio;
}
console.log("Valor de la venta: $",valorVenta(ventas[0]))


function totalVendido(ventas){
	let TotalV = 0;
	for (const TV of ventas){

		TotalV += valorVenta(TV)
		
	}
	return TotalV
}
console.log("Total Vendido: $",totalVendido(ventas))

function unidadesVendidas(ventas){
	let unidades = 0;
	for (const uV of ventas){
		
		unidades += uV.cantidad

	}

	return unidades;
	
}
console.log("Total venididos",unidadesVendidas(ventas))

function ventasMayor(ventas) {
  
  let mayorVenta = ventas[0];

  for (const vent of ventas) {
    if (valorVenta(vent) > valorVenta(mayorVenta)) {
      mayorVenta = vent;
    }
  }

  return mayorVenta;
}

const mejorVenta = ventasMayor(ventas);
console.log("La venta mayor fue:", mejorVenta);


function ticketPromedio(ventas) {
  const totalVentas = totalVendido(ventas);
  const cantidadVentas = ventas.length;

  if (cantidadVentas === 0) {
    return 0; 
  }

  return totalVentas / cantidadVentas;
}

const promedioTicket = ticketPromedio(ventas);
console.log("El ticket promedio es:", promedioTicket);


function ventasPorCiudad() {
  const conteo = {};

  for (const venta of ventas) {
    // Limpiamos espacios y pasamos a minúsculas ("Medellín" y "medellín")
    const ciudad = venta.ciudad.trim().toLowerCase();

    // Si la ciudad no existe aún, la iniciamos en 0
    if (!conteo[ciudad]) {
      conteo[ciudad] = 0;
    }

    // Sumamos 1 por cada registro de venta de esa ciudad
    conteo[ciudad] += 1;
  }



  return conteo;
}

console.log(ventasPorCiudad());




// usando metodos de arreglo

//metodo reduce para calcular el total vendido
const totalvendidoM=ventas.reduce((acumulador, venta) => acumulador + valorVenta(venta), 0);
console.log("Total vendido usando reduce: $", totalvendidoM);

// metodo reduce para calcular el total de unidades vendidas
const unidadesVendidasM=ventas.reduce((acumulador, venta) => acumulador + venta.cantidad, 0);
console.log("Total unidades vendidas usando reduce:", unidadesVendidasM);

// metodo reduce y filter para ver las ventas por ciudad
const ventasPorCiudadM = ventas.reduce((conteo, venta) => {
  const ciudad = venta.ciudad.trim().toLowerCase();
  conteo[ciudad] = (conteo[ciudad] || 0) + 1;
  return conteo;
}, {});

console.log("Ventas por ciudad usando reduce:", ventasPorCiudadM);



const totalPorCiudad = (ventas) =>
  ventas
    .filter((venta) => venta.cantidad > 0)
    .map((venta) => ({
      ciudad: venta.ciudad.trim().toLowerCase(),
      subtotal: venta.cantidad * venta.precio,
    }))
    .reduce((totales, item) => {
      totales[item.ciudad] = (totales[item.ciudad] || 0) + item.subtotal;
      return totales;
    }, {});

console.log(totalPorCiudad(ventas));