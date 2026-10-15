export interface DisneyPaginationInfo {
  count: number;
  totalPages: number;
  previousPage: string | null;
  nextPage: string | null;
}

export interface DisneyCharacter {
  _id: number;
  films: string[];
  shortFilms: string[];
  tvShows: string[];
  videoGames: string[];
  parkAttractions: string[];
  allies: string[];
  enemies: string[];
  name: string;
  imageUrl?: string;
  url: string;
  sourceUrl?: string;
}

export interface DisneyCharacterListResponse {
  info: DisneyPaginationInfo;
  data: DisneyCharacter[];
}

export interface DisneyCharacterDetailResponse {
  info: DisneyPaginationInfo;
  data: DisneyCharacter;
}

export interface DisneyCharacterQueryParams {
  page?: number;
  pageSize?: number;
  name?: string;
}
