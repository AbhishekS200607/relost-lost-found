# Relost - Lost & Found Web Application

A full-stack web application for managing lost and found items, built with Spring Boot backend and vanilla JavaScript frontend.

## Features

- **User Authentication**: JWT-based secure login and registration
- **Item Management**: Post, browse, and manage found items
- **Category Navigation**: Dedicated pages for different item categories
- **Anonymous Chat**: WhatsApp-like messaging system for item discussions
- **File Upload**: Image upload support with drag-and-drop
- **Responsive Design**: Mobile-first, modern UI design
- **Search & Filter**: Advanced filtering and search capabilities

## Technology Stack

- **Backend**: Java 17+, Spring Boot, Spring Security, Spring Data JPA
- **Database**: MySQL
- **Frontend**: HTML, CSS, JavaScript (ES6+)
- **Authentication**: JWT (JSON Web Tokens)
- **Build Tool**: Maven

## API Endpoints

### Authentication
- `POST /api/auth/register` - Register a new user
- `POST /api/auth/login` - Login and get JWT token

### Items
- `GET /api/items` - Get all found items
- `POST /api/items` - Create a new found item
- `DELETE /api/items/{id}` - Delete an item

### Chat
- `GET /api/chat/messages/{itemId}` - Get chat messages for an item
- `POST /api/chat/messages` - Send a chat message

### File Upload
- `POST /api/files/upload` - Upload images/files

## Setup Instructions

### Prerequisites
1. Java 17 or higher
2. Maven 3.6+
3. MySQL 8.0+

### Database Setup
1. Install and start MySQL server
2. Create a new database:
   ```sql
   CREATE DATABASE lostandfound_db;
   ```
3. Update `src/main/resources/application.properties` with your MySQL credentials

### Running the Application
1. Clone the repository
2. Navigate to the project directory
3. Run: `mvn spring-boot:run`
4. Access: `http://localhost:8080`

## Project Structure

```
src/
├── main/
│   ├── java/com/lostandfound/
│   │   ├── controller/          # REST controllers
│   │   ├── model/              # JPA entities
│   │   ├── repository/         # Data repositories
│   │   ├── service/            # Business logic
│   │   └── config/             # Security & CORS config
│   └── resources/
│       ├── static/             # Frontend files
│       │   ├── css/
│       │   ├── js/
│       │   └── *.html
│       └── application.properties
```

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Submit a pull request

## License

This project is open source and available under the MIT License.