# Codecool bootcamp Jan-Feb 2026
Goal: Develop a fullstack data-driven application with .NET, React, PostgreSQL  
Development is done with in an aglie style with 4 planned sprints and a linked github project page for this specific repo: [Experis-Codecool-team-project](https://github.com/users/nikolaihg/projects/2)


# Tech Summary
- **Frontend**: React (Vite)
- **Backend**: ASP.NET Core (.NET 8) REST API
- **Database**: PostgreSQL (Entiy Framework Core)
- **AUTH**: .NET security
- **Monorepo structure**: shared root folder with .env file
- **Tooling**:: Node.js. npm/pnpm. .NET SDK 8

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

