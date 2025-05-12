# Collectoriste

> **Collectoriste** is a modern, full‑stack marketplace where passionate collectors can **buy, sell and trade** their prized items with confidence—all verified by a trusted admin workflow.
>
> Built with **Spring Boot 3 + Angular 17**, secured with **JWT**, and powered by **PostgreSQL + Flyway**, Collectoriste emphasises clean architecture, high test coverage and a delightful UI/UX.

![Collectoriste banner](docs/assets/collectoriste_banner.png)

<p align="center">
  <a href="https://github.com/your‑org/collectoriste/actions"><img alt="Build" src="https://img.shields.io/github/actions/workflow/status/your‑org/collectoriste/ci.yml?logo=github&style=for-the-badge"></a>
  <a href="LICENSE"><img alt="License" src="https://img.shields.io/github/license/your‑org/collectoriste?style=for-the-badge"></a>
  <a href="https://github.com/your‑org/collectoriste/releases"><img alt="Releases" src="https://img.shields.io/github/v/release/your‑org/collectoriste?include_prereleases&style=for-the-badge"></a>
</p>

---

## ✨ Features

| Category         | Highlights                                                                                                                                                       |
| ---------------- | ---------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| **Marketplace**  | • Fixed‑price listings & timed auctions  \<br>• Item‑for‑item trade offers with optional cash top‑up  \<br>• Wishlist & saved searches                           |
| **Verification** | • Admin & expert roles  \<br>• Multi‑step verification workflow (pending → approved/rejected)  \<br>• Certificate & document storage                             |
| **Social**       | • In‑app chat  \<br>• Transaction‑based ratings & reviews  \<br>• Notifications (web & e‑mail)                                                                   |
| **Security**     | • Spring Security (JWT, BCrypt)  \<br>• Role‑based access control (USER, ADMIN, VERIFIER)  \<br>• Audit logging                                                  |
| **DevEx**        | • Modular codebase (backend / frontend)  \<br>• Zero‑downtime DB migrations with Flyway  \<br>• Docker Compose for local stack  \<br>• CI/CD with GitHub Actions |

## 🛠️ Tech Stack

| Layer           | Tech                                                                               |
| --------------- | ---------------------------------------------------------------------------------- |
| **Frontend**    | Angular 17 · TypeScript · RxJS · NgRx · TailwindCSS · Vite                         |
| **Backend**     | Spring Boot 3 · Java 21 · Spring Data JPA · Spring Security · MapStruct · Flyway   |
| **Database**    | PostgreSQL 14 (UUIDs with `uuid‑ossp`)                                             |
| **Build & Ops** | Docker · Docker Compose · GitHub Actions · OpenAPI 3 (Swagger UI) · Testcontainers |

## ⚙️ Architecture Snapshot

```text
               +--------------------+        HTTPS        +----------------+
               |  Angular App (SPA) |  <---------------->  |  Spring Boot   |
               +----------+---------+                     |  API Gateway   |
                          ^                               +--------+-------+
                          | JWT & REST                               |
                          |                                           v
                +---------+---------+       JDBC & JPA       +-------+-------+
                |  Keycloak (opt.)  |  <-------------------> | PostgreSQL    |
                +-------------------+                       +---------------+
```

> **Note:** Swap Keycloak for any OIDC provider or roll your own JWT token service—Collectoriste is agnostic.

---

## 🚀 Getting Started

### 1 · Prerequisites

* JDK 21+
* Node 18+ / PNPM 8+
* Docker & Docker Compose v2
* (Optional) Make ≥ 4.0 for convenience scripts

### 2 · Clone & bootstrap

```bash
# Fork first, then:
$ git clone https://github.com/your-org/collectoriste.git
$ cd collectoriste

# Spin everything up (backend, frontend, db, pgAdmin)
$ make dev       # or: docker compose up --build -d
```

Open **[http://localhost:4200](http://localhost:4200)** for the Angular app and **[http://localhost:8080/swagger-ui.html](http://localhost:8080/swagger-ui.html)** for API docs.

### 3 · Environment variables

| Name          | Default           | Description          |
| ------------- | ----------------- | -------------------- |
| `DB_HOST`     | `localhost`       | PostgreSQL host      |
| `DB_PORT`     | `5432`            | PostgreSQL port      |
| `DB_NAME`     | `collectoriste`   | DB name              |
| `DB_USER`     | `collector`       | DB user              |
| `DB_PASSWORD` | `password`        | DB password          |
| `JWT_SECRET`  | `please‑changeme` | HMAC 256 signing key |

Create an `.env` file or override in Docker Compose:

```yaml
services:
  backend:
    environment:
      - DB_PASSWORD=${DB_PASSWORD}
      - JWT_SECRET=${JWT_SECRET}
```

### 4 · Database migration

Flyway auto‑runs at app startup. To run manually:

```bash
# From backend module
$ ./mvnw flyway:migrate -Dflyway.configFiles=src/main/resources/flyway.conf
```

### 5 · Running tests

```bash
# Backend
$ ./mvnw test

# Frontend
$ pnpm test
```

---

## 📂 Project Structure

```
collectoriste/
├── backend/                # Spring Boot app (Maven multi‑module)
│   ├── api/                # REST controllers, DTOs
│   ├── domain/             # Business entities & services
│   ├── infrastructure/     # Repositories, security, config
│   ├── src/main/resources/db/migration/  # Flyway SQLs
│   └── ...
├── frontend/               # Angular workspace
│   ├── src/app/            # Feature & core modules (SCAM pattern)
│   └── ...
├── docker-compose.yml      # Dev stack (app + db + pgAdmin)
├── docs/                   # ADRs, schema diagrams, screenshots
└── README.md
```

---

## 🤝 Contributing

1. **Create an issue** describing your proposition/bug.
2. **Fork** → **feature branch** → **PR** (target `develop`).
3. Ensure **tests pass** & run `pnpm format` / `mvn spotless:apply`.

We follow the [Conventional Commits](https://www.conventionalcommits.org/) spec and use semantic versioning.

### Code of Conduct

Please read [CODE\_OF\_CONDUCT.md](CODE_OF_CONDUCT.md) before contributing.

---

## 🗺️ Roadmap

* [ ] V1: MVP (login, item listing, admin verification)
* [ ] V2: Trade offers & chat
* [ ] V3: Stripe integration, escrow payments
* [ ] V4: Mobile PWA + offline mode

See the [project board](https://github.com/your‑org/collectoriste/projects/1).

---

## 📜 License

Distributed under the **MIT License**. See [LICENSE](LICENSE) for more information.

---

## 🙏 Acknowledgements

* Inspired by great marketplaces like Discogs, CardMarket & StockX.
* Uses awesome OSS libraries: Spring, Angular, MapStruct, Testcontainers, Tailwind, etc.
* Logo designed by [@YourDesigner](https://github.com/YourDesigner).

> *“Collect things you love, because they represent who you are”—`Collector‑in‑Chief`*
