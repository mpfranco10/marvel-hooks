import type {
  DisneyCharacter,
  DisneyCharacterDetailResponse,
  DisneyCharacterListResponse,
  DisneyCharacterQueryParams,
} from "../types/disney";

const DISNEY_API_BASE_URL = "https://api.disneyapi.dev";

const parseResponse = async <T>(response: Response): Promise<T> => {
  if (!response.ok) {
    const message = await response.text();
    throw new Error(
      message || "The Disney API could not complete the request.",
    );
  }

  return response.json() as Promise<T>;
};

export const fetchCharacters = async ({
  page = 1,
  pageSize = 24,
  name = "",
}: DisneyCharacterQueryParams = {}): Promise<DisneyCharacterListResponse> => {
  const trimmedName = name.trim();
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  if (trimmedName) {
    params.set("name", trimmedName);
  }

  const response = await fetch(
    `${DISNEY_API_BASE_URL}/character?${params.toString()}`,
  );

  return parseResponse<DisneyCharacterListResponse>(response);
};

export const fetchCharacterById = async (
  characterId: number,
): Promise<DisneyCharacter> => {
  const response = await fetch(
    `${DISNEY_API_BASE_URL}/character/${characterId}`,
  );
  const payload = await parseResponse<DisneyCharacterDetailResponse>(response);

  return payload.data;
};
