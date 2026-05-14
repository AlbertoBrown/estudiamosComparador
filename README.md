# Comparador comercial 2.0TD

Prototipo web para comparar tarifas electricas 2.0TD y calcular comisiones de agentes.

## Incluye

- Subida y previsualizacion de factura.
- Formulario de consumos P1/P2/P3, potencia P1/P2 e importe pagado.
- Ranking de tarifas de Repsol, LoGOs, Endesa, Iberdrola y Naturgy.
- Calculo de coste estimado con energia, potencia, bono social, impuesto electrico, alquiler de contador e IVA.
- Vista responsive para escritorio, tablet y movil.
- Excel de comisiones y tarifas en `outputs/comisiones_y_tarifas_2_0.xlsx`.

## Ejecutar en local

```bash
node server.mjs
```

Abrir:

```text
http://127.0.0.1:8765/index.html
```

## Pendiente para produccion

- Backend.
- OCR de facturas.
- Base de datos.
- Panel admin de tarifas y comisiones.
- Motores 3.0TD, 3.1TD y gas empresa.
- Login, roles, historico y RGPD.
