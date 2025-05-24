# 🛰️ Collectorsite — Mercado Retro‑Futurista

Compra, vende e intercambia artículos de colección con verificación de imágenes/documentos, ofertas de intercambio en vivo y una interfaz de usuario retro‑futurista.

*Back‑end — Spring Boot 3.4.5 | Front‑end — Angular 19.2*

---

![Java](https://img.shields.io/badge/Java-17-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen?logo=spring)
![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions)

---

## ✨ Características

| Módulo             | Destacados                                         |
| ------------------ | -------------------------------------------------- |
| **Autenticación**  | JWT, roles (`USUARIO`, `ADMIN`, `VERIFICADOR`)     |
| **Artículos**      | CRUD, carga de imágenes + PDF a MinIO/S3           |
| **Verificación**   | Cola de administración, flujo `PENDIENTE→APROBADO/RECHAZADO` |
| **Publicaciones**  | Precio fijo y subasta, feed paginado              |
| **Ofertas de Intercambio** | Artículo por artículo ± efectivo, aceptar/rechazar |
| **Transacciones**  | Transferencia de propiedad, esqueleto de estado de pago |
| **Notificaciones** | Push por WebSocket + correo electrónico            |
| **UI**             | Tailwind, fuente RetroFuture, hologramas giratorios |

---

## 🖥️ Arquitectura

```
Angular 19.2  ⇆  Spring Boot 3.4.5
  (JWT)              │
                     │ REST + STOMP
                     ▼
 PostgreSQL ← Migraciones Flyway
      │
      └─ MinIO/S3 para multimedia
```

---

## 🚀 Inicio Rápido

### Prerrequisitos

| Herramienta | Versión |
| ----------- | ------- |
| JDK         | 17+     |
| Node        | 18+     |
| npm         | 10+     |
| Docker      | última  |

### Ejecutar con Docker Compose (Listo para Producción)

Clona el repositorio y ejecuta:

```bash
cd deploy
docker compose up -d
```

Accede a la aplicación en http://localhost

### Configuración de Desarrollo

1. Inicia la base de datos y el almacenamiento:

```bash
docker compose -f deploy/docker-compose.yml up -d db minio
```

2. Ejecuta el backend:

```bash
cd Backend
./mvnw spring-boot:run -Pdev
```

3. Ejecuta el frontend:

```bash
cd Frontend
npm install
npm start
```

Accede a la aplicación de desarrollo en http://localhost:4200

## Documentación de la API

La documentación de la API está disponible como una colección de Postman en `docs/collectorsite-api.postman.json`.

## Migraciones de Base de Datos

Las migraciones de la base de datos son manejadas automáticamente por Flyway cuando la aplicación se inicia.

Para ejecutar manualmente las migraciones:

```bash
cd Backend
./mvnw flyway:migrate
```

## Datos de Demostración

La aplicación incluye datos de ejemplo (migración V6) con usuarios de demostración:

- alice@example.com / password123 - Usuario regular
- bob@example.com / password123 - Usuario regular
- carol@example.com / password123 - Usuario administrador

## Despliegue

La aplicación se puede desplegar utilizando la configuración de Docker proporcionada. Para despliegues personalizados, actualiza las variables de entorno en el archivo docker-compose correspondientemente.

## Licencia

MIT © 2025 Equipo Collectorsite 