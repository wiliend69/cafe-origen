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

# Indicadores implementados y decisiones para arreglos vacíos

Las funciones de `src/analitica.js` se exportan para poder reutilizarlas y probarlas. `ticketPromedio` suma el ingreso (`cantidad * precio`) y cuenta únicamente las ventas con `cantidad > 0`; si no hay ventas válidas devuelve `0`. `ventasPorCiudad` también excluye registros con cantidad cero, suma el ingreso de la ciudad solicitada y compara `ciudad.trim().toLowerCase()` para ignorar mayúsculas y espacios al inicio o al final.

| Función | Resultado con arreglo vacío | Motivo |
| --- | --- | --- |
| `totalVendido([])` | `0` | No hay ingresos que acumular. |
| `unidadesVendidas([])` | `0` | No hay unidades que acumular. |
| `ticketPromedio([])` | `0` | No existe ninguna venta válida para promediar. |
| `ventasPorCiudad([], "Medellín")` | `0` | No hay ingresos en la ciudad. |
| `ventaMayor([])` | `null` | No existe un registro que devolver. |

# Trazas manuales

En estas trazas, el ingreso de cada registro es `cantidad * precio`; para el promedio y las ventas por ciudad se omiten las filas con `cantidad` igual a cero.

## Ticket promedio

| ID | Ingreso del registro | Ventas válidas acumuladas | Ingreso acumulado |
| --- | ---: | ---: | ---: |
| 1 | 84.000 | 1 | 84.000 |
| 2 | 26.000 | 2 | 110.000 |
| 3 | 95.000 | 3 | 205.000 |
| 4 | 42.000 | 4 | 247.000 |
| 5 | 135.000 | 5 | 382.000 |
| 6 | 52.000 | 6 | 434.000 |
| 7 | 120.000 | 7 | 554.000 |
| 8 | Excluido: cantidad 0 | 7 | 554.000 |
| 9 | 90.000 | 8 | 644.000 |
| 10 | 168.000 | 9 | 812.000 |
| 11 | 95.000 | 10 | 907.000 |
| 12 | 78.000 | 11 | 985.000 |
| Resultado | $985.000 / 11 | | **$89.545,45** |

La prueba del programa con el arreglo completo devuelve `985000 / 11`, que coincide con la división manual.

## Ventas de Medellín

La ciudad buscada se normaliza de `"  MEDELLÍN "` a `"medellín"`; se acumulan las filas cuya ciudad normalizada coincide.

| ID | Ciudad original | Ingreso | Total acumulado |
| --- | --- | ---: | ---: |
| 1 | Medellín | 84.000 | 84.000 |
| 4 | Medellín | 42.000 | 126.000 |
| 5 | medellín | 135.000 | 261.000 |
| 11 | Medellín | 95.000 | 356.000 |
| Resultado | | | **$356.000** |

La prueba del programa con la ciudad `"  MEDELLÍN "` devuelve `356000`, igual que la suma manual.

# Indicadores con métodos de arreglo

Las versiones con métodos mantienen el criterio de venta válida (`cantidad > 0`) de las funciones con ciclos. `filter` selecciona los registros válidos, `map` obtiene el valor o cantidad a sumar y `reduce` acumula con valor inicial `0`.

| Función | ¿Qué recorro? | ¿Qué filtro? | ¿Qué transformo? | ¿Qué acumulo? | ¿Cómo agrupo? |
| --- | --- | --- | --- | --- | --- |
| `totalVendidoM` | Todas las ventas. | Registros con `cantidad > 0`. | Cada venta a su ingreso (`cantidad * precio`). | Los ingresos con `reduce(..., 0)`. | No agrupa; produce un total general. |
| `unidadesVendidasM` | Todas las ventas. | Registros con `cantidad > 0`. | Cada venta a su `cantidad`. | Las unidades con `reduce(..., 0)`. | No agrupa; produce un total general. |
| `ventasPorCiudadM` | Todas las ventas. | Cantidad positiva y ciudad normalizada igual a la solicitada. | Cada venta coincidente a su ingreso. | Los ingresos de la ciudad con `reduce(..., 0)`. | No crea grupos; calcula la ciudad solicitada. |
| `totalPorCiudad` | Todas las ventas. | Registros con `cantidad > 0`. | La ciudad a `trim().toLowerCase()` y la venta a su ingreso. | Los ingresos por clave de ciudad. | Usa la ciudad normalizada como clave de un objeto diccionario. |
| `unidadesPorProducto` | Todas las ventas. | Registros con `cantidad > 0`. | Cada venta a producto y cantidad. | Las cantidades de cada producto. | Usa el nombre del producto como clave de un objeto diccionario. |
| `topProductosPorValor` | Todas las ventas. | Registros con `cantidad > 0`. | Cada venta a producto e ingreso; luego transforma el diccionario con `Object.entries`. | El ingreso de cada producto. | Agrupa por producto, copia las entradas con `...`, ordena de mayor a menor y toma `k` con `slice`. |

`verificar.js` compara sobre el mismo arreglo las versiones con ciclos y métodos de total vendido, unidades vendidas y ventas en Medellín. El resultado esperado para cada par es `OK`; el proceso termina con código de error si encuentra una diferencia. Las pruebas también comprueban las agrupaciones completas, unitarias y vacías, el orden del top y que el ranking no modifique el arreglo fuente.

# Reporte de negocio y depuración

`src/reporte.js` presenta el resumen general, los ingresos por ciudad, las unidades por producto, el top 3 por valor y dos resúmenes diarios. Los importes se formatean con `toLocaleString("es-CO")`; el reporte usa tablas para alinear los datos. El día `2026-09-01` tiene ventas y `2026-09-07` se usa como fecha sin registros.

No se encontraron descripciones originales de incidentes de la gerente en el repositorio. Para dejar verificable la depuración solicitada, se reproducen dos fallos representativos de las condiciones de estos datos y del reporte.

## Error 1: grupos de ciudad duplicados

- **Síntoma:** una ciudad aparece como más de un grupo cuando cambia la capitalización o hay espacios sobrantes.
- **Entrada que lo produce:** registros con `ciudad: "Medellín"` y `ciudad: "medellín"`; o un par con `"Bogotá"` y `"Bogotá "`.
- **Hipótesis:** el acumulador usa `venta.ciudad` sin normalizar como clave literal.
- **Prueba realizada:** `la normalización evita grupos duplicados por mayúsculas y espacios` en `src/analitica.test.js` demuestra que la agrupación sin normalizar crea cuatro claves para esas cuatro filas; `totalPorCiudad` produce solo `medellín` y `bogotá`.
- **Causa:** las cadenas con mayúsculas o espacios finales son claves distintas en un objeto.
- **Corrección:** aplicar `trim().toLowerCase()` antes de agrupar. La prueba confirma los totales corregidos de $219.000 para Medellín y $52.000 para Bogotá.

## Error 2: promedio `NaN` en fecha sin ventas

- **Síntoma:** el resumen de un día sin ventas puede mostrar `NaN` como ticket promedio.
- **Entrada que lo produce:** intentar calcular el promedio para `2026-09-07`, fecha que no aparece en los datos; la operación defectuosa `0 / 0` devuelve `NaN`.
- **Hipótesis:** el cálculo divide el ingreso total entre la cantidad de ventas sin comprobar si el divisor es cero.
- **Prueba realizada:** `ventasDelDia resume una fecha y devuelve ceros para una fecha vacía` comprueba que la fecha vacía tiene cero ventas, unidades, ingreso y ticket, y que el ticket no es `NaN` ni hay valores `undefined`.
- **Causa:** no se define un resultado para el promedio cuando el conteo de ventas válidas es cero.
- **Corrección:** `ticketPromedio` devuelve `0` cuando no hay ventas válidas y `ventasDelDia` construye un resumen completo con ceros. Para `2026-09-01`, la misma prueba confirma dos ventas, tres unidades, $110.000 y ticket de $55.000.
