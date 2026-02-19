# Codecool bootcamp Jan-Feb 2026
Goal: Develop a fullstack data-driven application with .NET, React, PostgreSQL  
Development is done with in an aglie style with 4 planned sprints and a linked github project page for this specific repo: [Experis-Codecool-team-project](https://github.com/users/nikolaihg/projects/2)

# Getting Started

## Prerequisites
- .NET SDK 10
- Node.js & npm/pnpm
- Docker & Docker Compose (for containerized development)
- PostgreSQL client (optional, for direct database access)

# Tech Summary
- **Frontend**: React (Vite)
- **Backend**: ASP.NET Core (.NET 10) REST API
- **Database**: PostgreSQL (Entiy Framework Core)
- **AUTH**: JWT
- **Monorepo structure**: shared root folder with .env file
- **Tooling**:: Node.js. npm/pnpm. .NET SDK 10

## Environment Setup
### Backend
Backend uses `dotnet user-secrets` so if you have cloned this project run: 
```bash
# 1. init
cd backend/Api
dotnet user-secrets init
# 2. Set postgres connection string
dotnet user-secrets set "ConnectionStrings:DefaultConnection" "Host=localhost;Port=5432;Database=tvshowlogger;Username=YOURUSERNAME;Password=YOURPASSWORD"
# 4. Set JWT signingKey
dotnet user-secrets set "Jwt:SigningKey" "SUPERLONGSECRETKEYDONTSHAREMIN32CHARS"
# 5. Change issuer and audience in ./backend/Api/appsettings.Docker.json if you want to change these
```

### Frontend

### Docker Compose
Docker compose uses a enviroment file called `.env.docker`located in root.  
So start by `cp .env.docker.example .env.docker` and fill out your secrets if you want to use docker compose. 
Then run the containers using:  
```bash
docker-compose --env-file .env.docker up --build
```
Ports: 
- The API will be available at `http://localhost:8080` 
- PostgreSQL at `http://localhost:5432`
- Frontendat `http://localhost:3000`

## Running with Docker Compose (Full Stack)

This runs both the API and PostgreSQL database in containers:

```bash
docker compose up --build
```


To stop the containers:
```bash
docker compose down
```

To stop and remove all data:
```bash
docker compose down -v
```

## Development with PostgreSQL Only

For faster development iteration, run just the PostgreSQL container and run the .NET backend locally.

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