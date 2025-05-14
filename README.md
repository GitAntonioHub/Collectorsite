# 🛰️ Collectorsite — Retro‑Futuristic Marketplace

Buy, sell & trade collectible items with image/document verification, live trade offers, and a retro‑futuristic UI.

*Back‑end — Spring Boot 3.4  |  Front‑end — Angular 17*

---

![Java](https://img.shields.io/badge/Java-17-blue?logo=openjdk)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-3.4.x-brightgreen?logo=spring)
![Angular](https://img.shields.io/badge/Angular-17-red?logo=angular)
![PostgreSQL](https://img.shields.io/badge/Database-PostgreSQL-blue?logo=postgresql)
![Actions](https://img.shields.io/badge/CI-GitHub%20Actions-blue?logo=githubactions)

---

## ✨ Features

| Module            | Highlights                                        |
| ----------------- | ------------------------------------------------- |
| **Auth**          | JWT, roles (`USER`, `ADMIN`, `VERIFIER`)          |
| **Items**         | CRUD, image + PDF upload to MinIO/S3              |
| **Verification**  | Admin queue, `PENDING→APPROVED/REJECTED` workflow |
| **Listings**      | Fixed‑price & auction, paginated feed             |
| **Trade offers**  | Item‑for‑item ± cash, accept/decline              |
| **Transactions**  | Ownership transfer, payment status skeleton       |
| **Notifications** | WebSocket push + e‑mail                           |
| **UI**            | Tailwind, RetroFuture font, spinning holograms    |

---

## 🖥️ Architecture

```
Angular 17  ⇆  Spring Boot 3
  (JWT)              │
                     │ REST + STOMP
                     ▼
 PostgreSQL ← Flyway migrations
      │
      └─ MinIO/S3 for media
```

---

## 🚀 Quick start (dev)

### 1 Prerequisites

| Tool   | Version |
| ------ | ------- |
| JDK    | 17+     |
| Node   | 20+     |
| npm    | 10+     |
| Docker | latest  |

### 2 Clone & boot infra

```bash
git clone https://github.com/GitAntonioHub/Collectorsite.git
cd Collectorsite
docker compose -f docker-compose.dev.yml up -d   # Postgres + MinIO
```

### 3 Backend

```bash
cd Backend
./mvnw flyway:migrate
./mvnw spring-boot:run      # http://localhost:8080
```

### 4 Frontend

```bash
cd ../collector-site
npm install
npm start                   # http://localhost:4200
```

---

## ⚙️ Environment vars

| Var                          | Default                                      | Description |
| ---------------------------- | -------------------------------------------- | ----------- |
| `SPRING_DATASOURCE_URL`      | `jdbc:postgresql://localhost:5432/collector` | DB URL      |
| `SPRING_DATASOURCE_USERNAME` | `collector`                                  | DB user     |
| `SPRING_DATASOURCE_PASSWORD` | `change-me`                                  | DB pass     |
| `JWT_SECRET`                 | `dev-secret`                                 | HMAC key    |
| `STORAGE_ENDPOINT`           | `http://localhost:9000`                      | MinIO       |
| …                            | …                                            | …           |

---

## 🧪 Tests

```bash
# Backend
cd Backend
./mvnw test

# Frontend
cd ../collector-site
npm run test      # Jest
npm run cy:open   # Cypress
```

---

## 🐳 Docker all‑in‑one

```bash
docker compose -f docker-compose.prod.yml up --build
# API :8080  –  Angular :80
```

---

## 📂 Repo layout

```
Backend/         Spring Boot
collector-site/  Angular 17
assets/          bg.jpg, holograms, fonts
```

---

## 🎯 Roadmap

* [ ] Stripe checkout
* [ ] Elasticsearch search
* [ ] Chat & PWA

---

## 🤝 Contributing

Fork → branch → PR.  Format with Spotless / Prettier; tests must pass.

---

## 📜 License

MIT © 2025 Collectorsite Team

