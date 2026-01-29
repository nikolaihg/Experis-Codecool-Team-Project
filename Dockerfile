FROM mcr.microsoft.com/dotnet/sdk:10.0 AS build
WORKDIR /src

# Copy project file
COPY backend/Api/Api.csproj ./Api/
# Restore as distinct layers
RUN dotnet restore ./Api/Api.csproj

# Copy everything
COPY backend/Api ./Api/
# Build and publish a release
WORKDIR /src/Api
RUN dotnet publish -c Release -o /app/publish

# Build runtime image
FROM mcr.microsoft.com/dotnet/aspnet:10.0
WORKDIR /app
COPY --from=build /app/publish .
EXPOSE 8080
ENTRYPOINT ["dotnet", "Api.dll"]