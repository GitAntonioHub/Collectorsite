# Collector-Site

A modern full-stack web application for collectors to manage, showcase, and trade their collectible items. Built with Angular and Spring Boot.

## 🚀 Features

- **User Authentication**: Secure login and registration system
- **Item Management**: Add, view, and manage your collection
- **Trading System**: Trade items with other collectors
- **Admin Panel**: Verification and moderation tools for administrators
- **Responsive Design**: Modern UI that works on desktop and mobile devices

## 🛠️ Tech Stack

### Frontend
- Angular (Latest Version)
- Angular Material
- RxJS
- TailwindCSS
- TypeScript

### Backend
- Spring Boot
- Spring Security with JWT
- Spring Data JPA
- PostgreSQL
- MinIO (Optional for storage)

## 📋 Prerequisites

- Node.js (v18 or higher)
- Java 17 or higher
- Maven
- PostgreSQL
- (Optional) MinIO server for storage

## 🔧 Installation

### Frontend Setup

1. Navigate to the Frontend directory:
```bash
cd Frontend
```

2. Install dependencies:
```bash
npm install
```

3. Create environment files:
```bash
cp src/environments/environment.example.ts src/environments/environment.ts
cp src/environments/environment.example.ts src/environments/environment.development.ts
```

4. Update the environment files with your configuration.

5. Start the development server:
```bash
npm start
```

### Backend Setup

1. Navigate to the Backend directory:
```bash
cd Backend
```

2. Copy the example application properties:
```bash
cp src/main/resources/application.example.yml src/main/resources/application.yml
```

3. Update `application.yml` with your database and other configurations.

4. Build and run the application:
```bash
./mvnw spring-boot:run
```

## 🔐 Environment Configuration

### Frontend Environment Variables
```typescript
export const environment = {
  production: false,
  api: 'http://localhost:8080/api',
  // Add other environment-specific variables here
};
```

### Backend Configuration (application.yml)
```yaml
spring:
  datasource:
    url: jdbc:postgresql://localhost:5432/collectorsite
    username: your_username
    password: your_password

  jpa:
    hibernate:
      ddl-auto: update

storage:
  enabled: false  # Set to true if using MinIO
  endpoint: http://localhost:9000
  accessKey: your_access_key
  secretKey: your_secret_key
  bucket: your_bucket_name
```

## 🏗️ Project Structure

```
├── Frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── auth/       # Authentication components
│   │   │   ├── core/       # Core services and guards
│   │   │   ├── items/      # Item management
│   │   │   └── shared/     # Shared components
│   │   └── environments/   # Environment configurations
│   └── package.json
│
└── Backend/
    └── src/
        └── main/
            ├── java/
            │   └── com/collectorsite/
            │       ├── auth/     # Authentication
            │       ├── items/    # Item management
            │       └── storage/  # Storage service
            └── resources/
                └── application.yml
```

## 🔒 Security

- JWT-based authentication
- Role-based access control (User/Admin)
- Secure password hashing
- Protected API endpoints
- XSS protection
- CSRF protection

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Commit your changes
4. Push to the branch
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👥 Authors

- Initial work - [Your Name]

## 🙏 Acknowledgments

- Angular team for the excellent framework
- Spring Boot team for the robust backend framework
- All contributors who have helped shape this project
