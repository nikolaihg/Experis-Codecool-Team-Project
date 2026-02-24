export async function getUserLists(): Promise<Array<{ id: number; name: string }>> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`api/Lists`, {
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