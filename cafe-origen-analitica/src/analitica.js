const ventas = require("./datos");

function valorVenta(ventas) {
	return ventas.cantidad * ventas.precio;
}


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

function ventasPorCiudad(ventas, ciudad) {
  let totalCiudad = 0;
  const ciudadBuscada = ciudad.trim().toLowerCase();

  for (const Buscada of ventas) {
    // 1. Usa 'Buscada.ciudad' (el objeto de la vuelta actual), no 'ventas'
    const ciudadRegistro = Buscada.ciudad.trim().toLowerCase();

    if (ciudadRegistro === ciudadBuscada) {
      // 2. Pasa 'Buscada' a valorVenta, no toda la lista 'ventas'
      totalCiudad += valorVenta(Buscada);
    }
  }
  return totalCiudad;
}


console.log("Ventas de Pereira:", ventasPorCiudad(ventas, "pereira"));
console.log("ventas de cali:", ventasPorCiudad(ventas, "cali"));
console.log("ventas de bogota: ", ventasPorCiudad(ventas, "bogota"));
console.log("Ventas de medellin:",ventasPorCiudad(ventas, "Medellín"));



