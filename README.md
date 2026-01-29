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
AS OF NOW we have to have two .env files one for docker and one for .NET SDK
so first:
1. cd to project root
2. `cp .env.example .env`
3. Edit the variables
4. cd backend/API
5. `cp .env.example .env`
6. Edit the variables

Note: In the "main" .env the postgres host has to be the same as the container name. But in backend folder it needs to be localhost.


Create a `.env` file in the project root with the following variables:
```
Database__Host=localhost
Database__Port=5432
Database__Name=tvshowlogger
Database__User=user
Database__Password=pwd123

Jwt__Issuer=TvShowloggerAPI
Jwt__Audience=TvShowloggerClient
Jwt__ExpiresInMinutes=60
Jwt__SigningKey=SUPERSECREKEYITSVERYLONGANDNEEDSTOBEOVER32CHARS
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