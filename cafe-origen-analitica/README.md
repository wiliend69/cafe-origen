# Café Origen Analítica

Proyecto de análisis de ventas de Café Origen. Usa un arreglo de registros de venta para calcular ingresos, unidades, tickets, agrupaciones por ciudad y producto, y rankings de productos. Los indicadores consideran válidos los registros con `cantidad > 0`; los nombres de ciudad se normalizan para evitar grupos duplicados por mayúsculas o espacios.

## Ejecución

Desde la carpeta `cafe-origen-analitica`, ejecuta el reporte de consola:

```sh
node src/reporte.js
```

Para verificar que los indicadores implementados con ciclos y métodos coinciden:

```sh
node src/verificar.js
```

Para ejecutar las pruebas automatizadas:

```sh
node --test src/analitica.test.js
```

## Preguntas que responde

- ¿Cuántas ventas válidas y unidades se registraron, cuál fue el ingreso total y cuál el ticket promedio?
- ¿Qué ciudad generó más ingresos?
- ¿Cuántas unidades se vendieron de cada producto?
- ¿Cuáles son los tres productos con mayor ingreso?
- ¿Cuál fue el resumen de ventas para una fecha específica, incluso si no hubo ventas?
- ¿Coinciden los cálculos hechos con ciclos y con métodos de arreglo?
