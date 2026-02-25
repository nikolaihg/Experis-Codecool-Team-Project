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


export async function deleteList(id: number, token: string): Promise<boolean> {
    try {
        const res = await fetch(`/api/lists/${id}`, {
            method: "DELETE",
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        if (res.status === 204) return true; 

        const message = await res.text();
        console.error("Failed to delete list:", message);
        return false;

    } catch (err) {
        console.error("Network error while deleting list");
        return false;
    }
}