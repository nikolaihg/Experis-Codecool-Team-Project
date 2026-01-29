# Codecool bootcamp Jan-Feb 2026
Goal: Develop a fullstack data-driven application with .NET, React, PostgreSQL  
Development is done with in an aglie style with 4 planned sprints and a linked github project page for this specific repo: [Experis-Codecool-team-project](https://github.com/users/nikolaihg/projects/2)

# Getting Started

## Prerequisites
- .NET SDK 10
- Node.js & npm/pnpm
- Docker & Docker Compose (for containerized development)
- PostgreSQL client (optional, for direct database access)

## Environment Setup

Create a `.env` file in the project root with the following variables:
```
DB_HOST=localhost
DB_PORT=5432
DB_NAME=tvshowlogger
DB_USER=postgres
DB_PASSWORD=your_secure_password_here
```

## Running with Docker Compose (Full Stack)

This runs both the API and PostgreSQL database in containers:

```bash
docker compose up --build
```

The API will be available at `http://localhost:8080` and PostgreSQL at `localhost:5432`.

To stop the containers:
```bash
docker compose down
```

To stop and remove all data:
```bash
docker compose down -v
```

## Development with PostgreSQL Only

For faster development iteration, run just the PostgreSQL container and run the .NET backend locally:

### Start PostgreSQL Container
```bash
docker compose up postgres -d
```

This runs PostgreSQL in the background. The connection string will be:
```
Host=localhost;Port=5432;Database=tvshowlogger;Username=postgres;Password=<DB_PASSWORD>
```

### Run the Backend
From the `backend/Api` directory:
```bash
cd backend/Api
dotnet run
```

The API will start in development mode at `http://localhost:5000` (or as configured in `launchSettings.json`).

### Stop PostgreSQL
```bash
docker compose down
```

# Tech Summary
- **Frontend**: React (Vite)
- **Backend**: ASP.NET Core (.NET 10) REST API
- **Database**: PostgreSQL (Entiy Framework Core)
- **AUTH**: JWT
- **Monorepo structure**: shared root folder with .env file
- **Tooling**:: Node.js. npm/pnpm. .NET SDK 10

# Project Structure
```
root/
backend/
  Api/
    Program.cs                # API entrypoint, DI setup, middleware, auth, CORS
    Controllers/              # HTTP layer, Defines routes and endpoints
    DTOs/                     # Data Transfer Objects (API contracts)
    Services/                 # Business logic layer
      Interfaces/             # Service contracts (abstractions), used by Controllers
      Implementations/        # Concrete service implementations
    Models/                   # Domain models / EF Core entities
    Data/                     # Persistence layer
      AppDbContext.cs         # EF Core DbContext
frontend/
  frontend-app/ # React web application
```
# Project documentation
The repo folder `\project-documentaion` contains diagrams, notes and other important documents created and gathered while we planned / developed this application.  
- Diagrams: `class-diagram.png`, `system-architecture-diagram.png`, `use-case-diagram.png`,
- Notes: `brainstormin.md`, etc