# Factura Pro v2 - Arquitectura

## Visión
La facturación electrónica que cualquiera puede entender. Empieza simple, crece contigo.

## Stack Tecnológico
- **Backend:** NestJS 10 (LTS), TypeORM 0.3.20, SQLite (MVP) / PostgreSQL (Prod).
- **Frontend:** React 18, Vite 5, TypeScript, Tailwind CSS, React Router.
- **Seguridad:** JWT, Passport, bcrypt, Aislamiento multi-tenant por `companyId`.

## Arquitectura
Monolito Modular. Separación estricta por dominios.
El frontend NUNCA envía el `companyId`. El `JwtAuthGuard` lo inyecta desde el token.

## Módulos
- `auth`: Autenticación y JWT.
- `companies`: Empresa emisora.
- `branches`: Sucursales.
- `customers`: Clientes.
- `products`: Productos y Servicios.
- `documents`: Comprobantes (Boleta, Factura, etc.).
- `sequences`: Series y correlativos atómicos.
- `billing`: XML UBL, Firma, SUNAT (Demo/Prod).
- `printing`: Formatos térmicos 58mm/80mm y PDF.
