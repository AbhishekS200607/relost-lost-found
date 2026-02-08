# Deployment Guide - Relost Application

This guide documents all configuration changes made to deploy the application on Railway and run it locally.

## Table of Contents
- [Local Development Setup](#local-development-setup)
- [Railway Production Deployment](#railway-production-deployment)
- [Configuration Changes](#configuration-changes)
- [Troubleshooting](#troubleshooting)

---

## Local Development Setup

### Prerequisites
- Java 17+
- Maven 3.6+
- MySQL 8.0+
- Git

### Step 1: Database Setup
```sql
CREATE DATABASE lostandfound_db;
```

### Step 2: Environment Variables
Create a `.env` file in the project root (already gitignored):

```env
DATABASE_URL=jdbc:mysql://localhost:3306/lostandfound_db?useSSL=false&allowPublicKeyRetrieval=true
MYSQL_USER=root
MYSQL_PASSWORD=Asn@2006
JWT_SECRET=dGhpc0lzQVZlcnlTZWN1cmVTZWNyZXRLZXlGb3JKV1RUaGF0SXNBdExlYXN0MjU2Qml0c0xvbmc=
```

### Step 3: Run Application
```bash
mvn clean install
mvn spring-boot:run
```

Access at: `http://localhost:8080`

---

## Railway Production Deployment

### Step 1: Create Railway Project
1. Sign up at [Railway.app](https://railway.app)
2. Create new project
3. Add MySQL database service
4. Connect GitHub repository

### Step 2: Configure Environment Variables
In Railway dashboard, add these variables:

```
DATABASE_URL=jdbc:mysql://root:<railway-mysql-password>@mysql.railway.internal:3306/railway
MYSQL_USER=root
MYSQL_PASSWORD=<railway-mysql-password>
JWT_SECRET=dGhpc0lzQVZlcnlTZWN1cmVTZWNyZXRLZXlGb3JKV1RUaGF0SXNBdExlYXN0MjU2Qml0c0xvbmc=
SPRING_PROFILES_ACTIVE=prod
```

**Note**: Railway auto-generates MySQL password. Find it in MySQL service variables.

### Step 3: Railway Configuration
Railway uses `railway.json` for deployment settings (auto-detected).

---

## Configuration Changes

### 1. Application Properties

#### `application.properties` (Local Development)
```properties
# Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=true
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000

# Health Check
management.endpoints.web.exposure.include=health
management.endpoint.health.show-details=always
```

**Key Changes**:
- ✅ Removed hardcoded credentials
- ✅ Added environment variable placeholders
- ✅ Added `allowPublicKeyRetrieval=true` for local MySQL
- ✅ Configured HikariCP connection pooling
- ✅ Added health check endpoint

#### `application-prod.properties` (Production)
```properties
# Database Configuration
spring.datasource.url=${DATABASE_URL}
spring.datasource.username=${MYSQL_USER}
spring.datasource.password=${MYSQL_PASSWORD}
spring.datasource.driver-class-name=com.mysql.cj.jdbc.Driver

# JPA Configuration
spring.jpa.hibernate.ddl-auto=update
spring.jpa.show-sql=false
spring.jpa.properties.hibernate.dialect=org.hibernate.dialect.MySQLDialect

# JWT Configuration
jwt.secret=${JWT_SECRET}
jwt.expiration=86400000

# Server Configuration
server.port=${PORT:8080}

# CORS Configuration
app.cors.allowed-origins=${CORS_ALLOWED_ORIGINS:*}

# HikariCP Connection Pool
spring.datasource.hikari.maximum-pool-size=10
spring.datasource.hikari.minimum-idle=5
spring.datasource.hikari.connection-timeout=30000
spring.datasource.hikari.idle-timeout=600000
spring.datasource.hikari.max-lifetime=1800000

# Health Check
management.endpoints.web.exposure.include=health
management.endpoint.health.show-details=always
```

**Key Changes**:
- ✅ Disabled SQL logging for production
- ✅ Dynamic port binding from Railway's `$PORT`
- ✅ Configurable CORS origins
- ✅ Optimized connection pool settings

### 2. Railway Deployment Config

#### `railway.json`
```json
{
  "$schema": "https://railway.app/railway.schema.json",
  "build": {
    "builder": "NIXPACKS"
  },
  "deploy": {
    "startCommand": "java -Dserver.port=$PORT -jar target/lost-and-found-0.0.1-SNAPSHOT.jar --spring.profiles.active=prod",
    "healthcheckPath": "/health",
    "healthcheckTimeout": 300
  }
}
```

**Key Changes**:
- ✅ Nixpacks builder for Java/Maven projects
- ✅ Custom start command with production profile
- ✅ Health check endpoint at `/health`
- ✅ 300-second timeout for startup

### 3. Security Configuration

#### `AuthController.java`
```java
@CrossOrigin(origins = "${app.cors.allowed-origins:*}")
@RestController
@RequestMapping("/api/auth")
public class AuthController {
    // ... controller code
}
```

**Key Changes**:
- ✅ Dynamic CORS configuration from environment variables

#### `HealthController.java`
```java
@RestController
public class HealthController {
    
    @GetMapping("/health")
    public Map<String, String> health() {
        Map<String, String> response = new HashMap<>();
        response.put("status", "UP");
        response.put("message", "Application is healthy");
        return response;
    }
}
```

**Key Changes**:
- ✅ Removed root endpoint (`/`) to allow static file serving
- ✅ Health check at `/health` for Railway monitoring

### 4. Git Configuration

#### `.gitignore`
```
# Environment Variables
.env
application-prod.properties

# Build artifacts
target/
*.jar
*.war

# IDE files
.idea/
*.iml
.vscode/
```

**Key Changes**:
- ✅ Excluded `.env` file with sensitive credentials
- ✅ Excluded production properties (optional, but safer)

---

## Deployment Workflow

### Local to GitHub
```bash
git add .
git commit -m "Your commit message"
git push origin main
```

### GitHub to Railway
- Railway auto-deploys on push to `main` branch
- Build process: Maven → JAR → Deploy
- Deployment time: ~2-3 minutes

---

## Troubleshooting

### Issue 1: Database Connection Timeout
**Problem**: App can't connect to MySQL  
**Solution**: 
- Verify `DATABASE_URL` format
- Check MySQL service is running
- Add `allowPublicKeyRetrieval=true` for local MySQL

### Issue 2: Frontend Not Showing
**Problem**: Root URL returns JSON instead of HTML  
**Solution**: 
- Remove `@GetMapping("/")` from controllers
- Spring Boot auto-serves `static/index.html` at root

### Issue 3: Health Check Failing
**Problem**: Railway deployment fails health check  
**Solution**: 
- Ensure `/health` endpoint exists
- Match `healthcheckPath` in `railway.json`
- Increase `healthcheckTimeout` if needed

### Issue 4: Port Binding Error
**Problem**: Application fails to start on Railway  
**Solution**: 
- Use `server.port=${PORT:8080}` in properties
- Pass `-Dserver.port=$PORT` in start command

### Issue 5: CORS Errors
**Problem**: Frontend can't call backend APIs  
**Solution**: 
- Configure `@CrossOrigin` on controllers
- Set `CORS_ALLOWED_ORIGINS` environment variable

---

## Environment Comparison

| Feature | Local Development | Railway Production |
|---------|------------------|-------------------|
| Database | MySQL (localhost:3306) | Railway MySQL (internal) |
| Port | 8080 | Dynamic ($PORT) |
| Profile | default | prod |
| SQL Logging | Enabled | Disabled |
| CORS | Allow all (*) | Configurable |
| Health Check | Optional | Required |

---

## Security Best Practices

✅ **Implemented**:
- No hardcoded credentials in code
- Environment variables for sensitive data
- `.env` file gitignored
- JWT secret externalized
- Production profile separation

⚠️ **Recommendations**:
- Rotate JWT secret regularly
- Use strong database passwords
- Enable HTTPS in production (Railway provides this)
- Implement rate limiting for APIs
- Add input validation and sanitization

---

## Live Deployment

🚀 **Production URL**: [https://lostandfound.up.railway.app](https://lostandfound.up.railway.app)

**Deployment Details**:
- Region: Southeast Asia (Singapore)
- Resources: 2 vCPU, 1GB RAM
- Auto-deploy: Enabled on `main` branch
- Health monitoring: Active

---

## Summary of Changes

1. ✅ Externalized all credentials to environment variables
2. ✅ Created separate production configuration profile
3. ✅ Added Railway deployment configuration
4. ✅ Implemented health check endpoint
5. ✅ Fixed static file serving at root URL
6. ✅ Configured CORS for cross-origin requests
7. ✅ Optimized database connection pooling
8. ✅ Set up auto-deployment from GitHub
9. ✅ Added comprehensive `.gitignore` rules
10. ✅ Documented entire deployment process

---

**Last Updated**: December 2024  
**Deployment Status**: ✅ Active and Running
