# 🛰️ Collectorsite — Retro‑Futuristic Marketplace

Buy, sell & trade collectible items with image/document verification, live trade offers, and a retro‑futuristic UI.

*Back‑end — Spring Boot 3.4.5 | Front‑end — Angular 19.2*

---

![Java](https://img.shields.io/badge/Java-17-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.5-brightgreen?logo=spring)
![Angular](https://img.shields.io/badge/Angular-19.2-red?logo=angular)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions)

---

## ✨ Features

| Module            | Highlights                                        |
| ----------------- | ------------------------------------------------- |
| **Auth**          | JWT, roles (`USER`, `ADMIN`, `VERIFIER`)          |
| **Items**         | CRUD, image + PDF upload to MinIO/S3              |
| **Verification**  | Admin queue, `PENDING→APPROVED/REJECTED` workflow |
| **Listings**      | Fixed‑price & auction, paginated feed             |
| **Trade offers**  | Item‑for‑item ± cash, accept/decline              |
| **Transactions**  | Ownership transfer, payment status skeleton       |
| **Notifications** | WebSocket push + e‑mail                           |
| **UI**            | Tailwind, RetroFuture font, spinning holograms    |

---

## 🖥️ Architecture

```
Angular 19.2  ⇆  Spring Boot 3.4.5
  (JWT)              │
                     │ REST + STOMP
                     ▼
 PostgreSQL ← Flyway migrations
      │
      └─ MinIO/S3 for media
```

---

## 🚀 Quick Start

### Prerequisites

| Tool   | Version |
| ------ | ------- |
| JDK    | 17+     |
| Node   | 18+     |
| npm    | 10+     |
| Docker | latest  |

### Run with Docker Compose (Production-ready)

Clone the repository and run:

```bash
cd deploy
docker compose up -d
```

Access the application at http://localhost

### Development Setup

1. Start the database and storage:

```bash
docker compose -f deploy/docker-compose.yml up -d db minio
```

2. Run the backend:

```bash
cd Backend
./mvnw spring-boot:run -Pdev
```

3. Run the frontend:

```bash
cd Frontend
npm install
npm start
```

Access the development application at http://localhost:4200

## API Documentation

The API documentation is available as a Postman collection at `docs/collectorsite-api.postman.json`.

## Database Migrations

Database migrations are handled automatically by Flyway when the application starts.

To manually run migrations:

```bash
cd Backend
./mvnw flyway:migrate
```

## Demo Data

The application includes seed data (V6 migration) with demo users:

- alice@example.com / password123 - Regular user
- bob@example.com / password123 - Regular user
- carol@example.com / password123 - Admin user

## Deployment

The application can be deployed using the provided Docker setup. For custom deployments, update the environment variables in the docker-compose file accordingly.

## License

MIT © 2025 Collectorsite Team

