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

export type FormState = {
  userListId: string;
  tvShowId: string;
  status: string;
  rating: string;
};

export type JwtPayload = {
    sub?: string;
    email?: string;
    nameid?: string;
    [key: string]: unknown;
};

export interface JwtClaims {
  sub: string
  email: string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/nameidentifier": string
  "http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name": string
  "http://schemas.microsoft.com/ws/2008/06/identity/claims/role": string
  exp: number
  iss: string
  aud: string
  [key: string]: unknown
}
