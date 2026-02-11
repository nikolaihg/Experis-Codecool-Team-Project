const API_BASE = "https://localhost:5102";

export async function addTvShowToList(
  userId: string,
  listId: number,
  tvShowId: string,
  status?: string,
  rating?: number
): Promise<{ id: number; userListId: number; tvShowId: string; status: string; rating: number }> {
  const token = localStorage.getItem("token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`${API_BASE}/users/${userId}/lists/${listId}/entries`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tvShowId: parseInt(tvShowId),
      status,
      rating,
    }),
  });

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

  const response = await fetch(`${API_BASE}/users/${userId}/lists`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch user lists: ${response.status}`);
  }

  return response.json();
}
