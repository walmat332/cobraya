# Factura Pro v2 - Registro de Decisiones

## 1. NestJS 10 vs 12
**Decisión:** Usar NestJS 10 LTS.
**Razón:** La versión 12 presenta conflictos de inyección de dependencias (`ModuleRef`) con TypeORM 0.3.x. La v10 es estable y probada.

## 2. Impresión Portátil
**Decisión:** HTML/CSS con `@media print` (58mm/80mm).
**Razón:** Los navegadores no soportan ESC/POS nativo de forma estable. Usar la ventana de impresión del sistema operativo es la solución más robusta para el MVP.

## 3. SUNAT Demo vs Producción
**Decisión:** Patrón Strategy (`ISunatProvider`).
**Razón:** Permite desarrollar y probar el flujo completo sin credenciales reales, alternando entre `DemoProvider` y `RealProvider` mediante variables de entorno.
