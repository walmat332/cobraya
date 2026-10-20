# Factura Pro v2 - MVP 0 (Boleta)

## Objetivo
Lograr el flujo completo de emisión de una BOLETA electrónica.

## Flujo
1. Registro de Usuario y Empresa.
2. Configuración de Sucursal y Series.
3. Creación de Cliente y Producto/Servicio.
4. Nueva Venta -> Selección -> Cálculo -> Emisión.
5. Generación XML UBL 2.1 -> Firma (Mock) -> Envío (Demo SUNAT).
6. Recepción de CDR -> Actualización de estado.
7. Impresión térmica (HTML/CSS 58mm) y Descarga PDF.

## Criterios de Aceptación
- El usuario puede emitir una boleta en menos de 30 segundos.
- El sistema genera un XML válido y un CDR simulado.
- El comprobante se puede imprimir en formato térmico.
