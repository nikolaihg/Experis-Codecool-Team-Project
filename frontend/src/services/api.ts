const API_BASE = "http://localhost:5102";

class UserWatchStatus{}

export async function addTvShowToList(
  userId: string,
  listId: number,
  tvShowId: string,
  status?: UserWatchStatus,
  rating?: number
): Promise<{ id: number; userListId: number; tvShowId: string; status: string; rating: number }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE}/api/User/${userId}/lists/${Number(listId)}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      userEntry:
      {
        TVShowId: parseInt(tvShowId),
        Id: userId,
        UserListId: listId,
        Status: status,
        Rating: rating,
      }
    }),
  });

  console.log(tvShowId)

  if (!response.ok) {
    const errorData = await response.text();
    throw new Error(`Failed to add TV show: ${response.status} ${errorData}`);
  }

  return response.json();
}

export async function getUserLists(userId: string): Promise<Array<{ id: number; name: string }>> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE}/api/User/${userId}/lists`, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user lists: ${response.status}`);
  }

  return response.json();
}
