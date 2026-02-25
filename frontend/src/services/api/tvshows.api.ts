import type { TVShow } from "../../types";

export async function addTvShowToList(
  listId: number,
  tvShowId: string,
  status?: number,
  rating?: number
): Promise<{ id: number; userListId: number; tvShowId: string; status: string; rating: number }> {
  const token = localStorage.getItem("auth_token");
  if (!token) {
    throw new Error("No auth token found");
  }

  const response = await fetch(`api/lists/${Number(listId)}/items`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({
      tvShowId: Number(tvShowId),
      userListId: Number(listId),
      status: status ? Number(status) : 0,
      rating: rating ? Number(rating) : 0
    }),
  });

  console.log("Sending: " + JSON.stringify({
    tvShowId: Number(tvShowId),
    userListId: Number(listId),
    status: status ? Number(status) : 0,
    rating: rating ? Number(rating) : 0
  }));

  if (!response.ok) {
    const errorData = await response.text();
        if (response.status === 409) {
            throw new Error("TV show is already in this list.");
        }
    throw new Error(`Failed to add TV show: ${response.status} ${errorData}`);
  }

  if (response.status === 204) {
    return { id: 0, userListId: listId, tvShowId: tvShowId, status: "success", rating: 0 };
  }

  return response.json();
}

export async function getAllTvShows(): Promise<TVShow[]> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("No auth token found");
    }

    const response = await fetch(`api/TVShow`, {
        method: "GET",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const errorData = await response.text();
        throw new Error(`Failed to fetch TV shows: ${response.status} ${errorData}`);
    }

    const data = await response.json();
    // Ensure ids are strings as per frontend type
    return data.map((show: any) => ({
      ...show,
      id: String(show.id),
      status: Number(show.status),
      releaseYear: Number(show.releaseYear),
      imdbRating: Number(show.imdbRating),
      amountOfEpisodes: Number(show.amountOfEpisodes)
    }));
}

export async function createTvShow(tvShow: Omit<TVShow, "id">): Promise<void> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("No auth token found");
    }

    const payload = {
        ...tvShow,
        status: Number(tvShow.status),
        imdbRating: Number(tvShow.imdbRating),
        releaseYear: Number(tvShow.releaseYear),
        amountOfEpisodes: Number(tvShow.amountOfEpisodes)
    };

    const response = await fetch(`api/TVShow`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to create TV show: ${error}`);
    }
}

export async function updateTvShow(id: string, tvShow: TVShow): Promise<void> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("No auth token found");
    }

    const payload = {
        ...tvShow,
        id: Number(tvShow.id),
        status: Number(tvShow.status),
        imdbRating: Number(tvShow.imdbRating),
        releaseYear: Number(tvShow.releaseYear),
        amountOfEpisodes: Number(tvShow.amountOfEpisodes)
    };

    const response = await fetch(`api/TVShow/${Number(id)}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(payload),
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to update TV show: ${error}`);
    }
}

export async function deleteTvShow(id: string): Promise<void> {
    const token = localStorage.getItem("auth_token");
    if (!token) {
        throw new Error("No auth token found");
    }

    const response = await fetch(`api/TVShow/${Number(id)}`, {
        method: "DELETE",
        headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
        },
    });

    if (!response.ok) {
        const error = await response.text();
        throw new Error(`Failed to delete TV show: ${error}`);
    }
}


