const ventas = require("./datos");

function valorVenta(ventas) {
	return ventas.cantidad * ventas.precio;
}
console.log("Valor de la venta: $", valorVenta(ventas[0]));


function totalVendido(ventas) {
    let total = 0;
    for (let i = 0; i < ventas.length; i++) {
        total += valorVenta(ventas[i]);
    }
    return total; 
}
 console.log("Total vendido: $", totalVendido(ventas));

function unidadesVendidas(ventas) {
let totalVendidas = 0; 
    for (let i=0; i<ventas.length; i++){
        if (ventas[i].cantidad > 0){
            totalVendidas += ventas[i].cantidad;

        }
    }
	return totalVendidas;
}
console.log("Total de unidades: $",unidadesVendidas(ventas[i]))

function ventaMayor(ventas) {
	
}


