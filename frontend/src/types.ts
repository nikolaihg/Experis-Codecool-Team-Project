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