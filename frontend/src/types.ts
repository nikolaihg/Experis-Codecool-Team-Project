export type TVShow = {
    id: string,
    title: string,
    description: string,
    posterUrl: string,
    status: number,
    imdbRating: number,
    releaseYear: number,
    genre: string,
    amountOfEpisodes: number
}

export type UserShowEntry = {
  id: number,
  loggedAt: string,
  position: number,
  rating: number,
  status: number,
  tvShow: TVShow,
  tvShowId: number,
  userListId: number
}

export type UserListOption = {
  id: number;
  name: string;
};

export type TVShowOption = {
  id: string;
  title: string;
};

export type AddTvShowPayload = {
  userListId: number;
  tvShowId: number;
  status?: string;
  rating?: number;
};

export type AddTvShowProps = {
  tvShow?: TVShowOption | null;
  onAdd?: (payload: AddTvShowPayload) => Promise<void> | void;
};

export type FormState = {
  userListId: string;
  tvShowId: string;
  status: string;
  rating: string;
};