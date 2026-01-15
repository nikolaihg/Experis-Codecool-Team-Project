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