# Diccionario de datos

| Propiedad | Tipo | Significado |
| --- | --- | --- |
| `id` | `number` | Identificador único del registro de venta. |
| `fecha` | `string` | Fecha de la venta en formato `AAAA-MM-DD`. |
| `cliente` | `string` | Código que identifica al cliente, por ejemplo, `C01`. |
| `producto` | `string` | Nombre o descripción del producto vendido. |
| `ciudad` | `string` | Ciudad asociada a la venta. |
| `cantidad` | `number` | Unidades del producto registradas en la venta. |
| `precio` | `number` | Precio unitario del producto en pesos colombianos. |

# Casos borde detectados

| Caso | Problema de calidad | Decisión |
| --- | --- | --- |
| Ciudad (`id: 5`) | `medellín` tiene una capitalización distinta de `Medellín`, aunque ambas parecen referirse a la misma ciudad. | Normalizar a `Medellín` para agrupar y analizar; conservar el valor original en los datos de origen. |
| Cantidad (`id: 8`) | La venta tiene `cantidad: 0`, por lo que no representa unidades vendidas y puede ser un dato incompleto o un registro que no se concretó. | Mantener el registro para trazabilidad, marcarlo para revisión y excluirlo de los cálculos de unidades e ingresos hasta confirmarlo. |
| Cliente (`C01`–`C08`) | Solo hay códigos de cliente y no se incluye un catálogo para verificar identidades, existencia o posibles duplicados. | Conservar los códigos como texto y no inferir identidades; solicitar un catálogo antes de validar o enriquecer clientes. |

# Plan de indicadores en pseudocódigo

Para los indicadores de ventas se consideran válidos los registros con `cantidad > 0`. El ingreso de cada registro se calcula como `cantidad * precio`.

## Ventas válidas

Recorro `ventas`; si `cantidad > 0`, cuento el registro. Inicio el acumulador en `0`.

```text
ventasValidas = 0
para cada venta en ventas:
	si venta.cantidad > 0:
		ventasValidas = ventasValidas + 1
```

## Unidades vendidas

Recorro `ventas`; si `cantidad > 0`, acumulo las unidades. Inicio el acumulador en `0`.

```text
unidadesTotales = 0
para cada venta en ventas:
	si venta.cantidad > 0:
		unidadesTotales = unidadesTotales + venta.cantidad
```

## Ingresos totales

Recorro `ventas`; si `cantidad > 0`, acumulo `cantidad * precio`. Inicio el acumulador en `0`.

```text
ingresosTotales = 0
para cada venta en ventas:
	si venta.cantidad > 0:
		ingresosTotales = ingresosTotales + venta.cantidad * venta.precio
```

## Unidades por producto

Recorro `ventas`; si `cantidad > 0`, acumulo la cantidad bajo el nombre del producto. Inicio el mapa vacío y cada producto nuevo en `0`.

```text
unidadesPorProducto = mapa vacío
para cada venta en ventas:
	si venta.cantidad > 0:
		si venta.producto no existe en unidadesPorProducto:
			unidadesPorProducto[venta.producto] = 0
		unidadesPorProducto[venta.producto] += venta.cantidad
```

## Ingresos por ciudad

Recorro `ventas`; si `cantidad > 0`, normalizo la ciudad para unificar diferencias de mayúsculas y acumulo `cantidad * precio`. Inicio el mapa vacío y cada ciudad nueva en `0`.

```text
ingresosPorCiudad = mapa vacío
para cada venta en ventas:
	si venta.cantidad > 0:
		ciudadNormalizada = normalizar mayúsculas y espacios de venta.ciudad
		si ciudadNormalizada no existe en ingresosPorCiudad:
			ingresosPorCiudad[ciudadNormalizada] = 0
		ingresosPorCiudad[ciudadNormalizada] += venta.cantidad * venta.precio
```

## Ingresos por cliente

Recorro `ventas`; si `cantidad > 0`, acumulo `cantidad * precio` bajo el código del cliente. Inicio el mapa vacío y cada código nuevo en `0`; no convierto los códigos a números ni infiero identidades.

```text
ingresosPorCliente = mapa vacío
para cada venta en ventas:
	si venta.cantidad > 0:
		si venta.cliente no existe en ingresosPorCliente:
			ingresosPorCliente[venta.cliente] = 0
		ingresosPorCliente[venta.cliente] += venta.cantidad * venta.precio
```
