# Codecool bootcamp Jan-Feb 2026
Goal: Develop a fullstack data-driven application with .NET, React, PostgreSQL  
Development is done with in an aglie style with 4 planned sprints and a linked github project page for this specific repo: [Experis-Codecool-team-project](https://github.com/users/nikolaihg/projects/2)

# Tech Summary
- **Frontend**: React (Vite)
- **Backend**: ASP.NET Core (.NET 10) REST API
- **Database**: PostgreSQL (Entiy Framework Core)
- **AUTH**: JWT
- **Monorepo structure**: shared root folder with .env file
- **Tooling**:: Node.js. npm/pnpm. .NET SDK 10

# Project Structure
```
repo root/
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

# Commands for later
- intialize frontend
```bash
cd frontend
npm create vite@latest frontend-app --template react-ts
cd frontend-app
npm install
```

- Add Entity Framework Core
```bash
cd Api
dotnet add package Microsoft.EntityFrameworkCore 
dotnet add package Npgsql.EntityFrameworkCore.PostgreSQL
```
- Add ASP.NET Security 
```bash
cd Api
dotnet add package Microsoft.AspNetCore.Authentication
dotnet add package Microsoft.AspNetCore.Authorization
```

