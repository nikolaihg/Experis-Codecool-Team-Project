# API Refactor Proposal: Flattened List Handling

## Endpoint Structure

### 1. Auth (`/api/auth`)
*Status: Unchanged*
*   `POST /register`: Register a new user.
*   `POST /login`: Authenticate and receive a token.
*   `POST /ping`: PONG

### 2. User (`/api/user`)
*Status: Refactored*
*   **Purpose:** strictly for user profile management and admin user administration.
*   **Removed Endpoints:**
    *   `GET /{userId}/lists`
    *   `POST /{userId}/lists`
*   **Retained/Updated Endpoints:**
    *   `GET /`: Get all users (Admin/User).
    *   `GET /{id}`: Get specific user profile details.
    *   `PUT /{id}`: Update user profile (email, password, settings).
    *   `DELETE /{id}`: Delete a user (Admin).

### 3. Lists (`/api/lists`)
*Status: New Controller*
*   **Purpose:** Centralized management for all User Lists (Watchlists, Diaries, Custom Collections).
*   **Key Concept:** The backend automatically identifies the "owner" of the list via the authenticated user's token (JWT), removing the need to pass `userId` in the URL for standard operations.

#### Endpoints

| Method | Endpoint | Role | Description |
| :--- | :--- | :--- | :--- |
| **GET** | `/api/lists` | User | Get all lists belonging to the **current authenticated user**. |
| **POST** | `/api/lists` | User | Create a new list for the **current authenticated user**. |
| **GET** | `/api/lists/{id}` | User | Get details of a specific list (including its items). |
| **PUT** | `/api/lists/{id}` | User | Update list metadata (name, privacy, type). |
| **DELETE** | `/api/lists/{id}` | User | Delete a list. |
| **POST** | `/api/lists/{id}/items` | User | Add an item (Show) to a specific list. |
| **DEL** | `/api/lists/{id}/items/{itemId}` | User | Remove an item from a specific list. |

---

## Sample Data & Scenarios

### Scenario 1: Creating a Watchlist
**Endpoint:** `POST /api/lists`
**Header:** `Authorization: Bearer <token>`
**Request Body:**
*Note: No `userId` is needed in the body; it is extracted from the token.*

```json
{
  "name": "My Weekend Binge",
  "type": "Watchlist",
  "isPublic": true
}
```

**Response (201 Created):**

```json
{
  "id": 42,
  "name": "My Weekend Binge",
  "type": "Watchlist",
  "isPublic": true,
  "createdAt": "2026-02-13T10:00:00Z",
  "itemCount": 0
}
```
### Scenario 1.5: Creating a List with Pre-filled Items
**Endpoint:** `POST /api/lists`
**Header:** `Authorization: Bearer <token>`
**Request Body:**

```json
{
  "name": "All Time Favorites",
  "type": "Collection",
  "isPublic": true,
  "items": [
    {
      "tvShowId": "3fa85f64-5717-4562-b3fc-2c963f66afa6",
      "status": "Completed",
      "rating": 10
    }
  ]
}
```

**Response (201 Created):**

```json
{
  "id": 43,
  "name": "All Time Favorites",
  "type": "Collection",
  "isPublic": true,
  "itemCount": 1
}
```
### Scenario 2: Getting My Lists
**Endpoint:** `GET /api/lists`
**Header:** `Authorization: Bearer <token>`

**Response (200 OK):**

```json
[
  {
    "id": 10,
    "name": "2025 Moving Diary",
    "type": "Diary",
    "isPublic": false,
    "createdAt": "2025-01-01T12:00:00Z"
  },
  {
    "id": 42,
    "name": "My Weekend Binge",
    "type": "Watchlist",
    "isPublic": true,
    "createdAt": "2026-02-13T10:00:00Z"
  }
]
```

## Implementation Checklist

1.  **Create `ListsController.cs`**:
    *   Inject `IUserListRepository` and `IUserRepository`.
    *   Implement methods extracting `UserId` from `User.Identity`.
2.  **Refactor `CreateUserListDto`**:
    *   Ensure it matches the simpler payload requirements.
3.  **Clean up `UserController.cs`**:
    *   Remove list-specific methods.
4.  **Update Frontend**:
    *   Update API calls to point to `/api/lists` instead of `/api/user/...`.

## Technical Implementation Details (Code Changes)

### 1. Repositories (`backend/Api/Repositories/`)
The current `IUserListRepository` is generic and lacks a dedicated method to fetch lists by a specific user efficiently. relying on `UserRepository.Read` (which includes lists) is not optimal for the `/lists` endpoint.

*   **Edit `IUserListRepository.cs`**:
    *   Add method: `Task<IEnumerable<UserList>> GetByUserId(string userId);`
*   **Edit `UserListRepository.cs`**:
    *   Implement method:
        ```csharp
        public async Task<IEnumerable<UserList>> GetByUserId(string userId)
        {
            return await _context.UserLists
                .Where(l => l.UserId == userId)
                .AsNoTracking()
                .ToListAsync();
        }
        ```

### 2. Controllers (`backend/Api/Controllers/`)

#### Create `ListsController.cs`
This new controller will handle all list logic.
*   **Dependencies**: `IUserListRepository`, `IUserRepository` (optional, for validation), `ILogger`.
*   **Helpers**: Method to get current UserId from claims: `User.FindFirst(System.Security.Claims.ClaimTypes.NameIdentifier)?.Value`.
*   **Actions**:
    *   `[HttpGet] GetLists()`: Calls `_repo.GetByUserId(currentUserId)`.
    *   `[HttpPost] CreateList([FromBody] CreateUserListDto dto)`:
        *   Extracts `currentUserId`.
        *   Creates `UserList` entity mapping DTO + UserId.
        *   Calls `_repo.Create`.
    *   `[HttpGet("{id}")] GetList(int id)`: Calls `_repo.Read(id)`. *Security check: ensure list belongs to internal user or is public.*
    *   `[HttpPut("{id}")] UpdateList(int id, ...)`: Updates list. *Security check required.*
    *   `[HttpDelete("{id}")] DeleteList(int id)`: Deletes list. *Security check required.*

#### Update `UserController.cs`
*   **Remove**: `GetUserLists` method.
*   **Remove**: `CreateUserList` method.
*   **Clean up**: `IUserListRepository` dependency might no longer be needed in `UserController` if all list logic moves out.

### 3. Models & DTOs
*   **`CreateUserListDto`**:
    *   **Update**: Add an optional `items` property to allow creating a list with initial shows.
        ```csharp
        public class CreateListEntryDto 
        {
            public Guid TvShowId { get; set; } // Assuming Guid based on UserShowEntry model
            public UserWatchStatus Status { get; set; }
            public int? Rating { get; set; }
        }
        
        // In CreateUserListDto:
        public List<CreateListEntryDto>? Items { get; set; }
        ```
*   **`UpdateUserListDto`**: *Recommended* to create this DTO to prevent over-posting (e.g., preventing users from changing the `UserId` or `CreatedAt` dates) during updates. Currently, `UserListRepository.Update` takes the full `UserList` model, which is risky.

### 4. Database Context
*   `AppDbContext` and Entity Framework configurations appear compatible with these changes. No schema migration is required strictly for the refactor, as the relationships (`User` -> `UserLists`) remain the same.

