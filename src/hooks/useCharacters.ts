import { useQuery } from "@tanstack/react-query";

import { fetchCharacterById, fetchCharacters } from "../api/disneyApi";

export const charactersQueryOptions = ({
  page,
  pageSize,
  searchTerm,
}: {
  page: number;
  pageSize: number;
  searchTerm: string;
}) => ({
  queryKey: ["characters", { page, pageSize, searchTerm }],
  queryFn: () =>
    fetchCharacters({
      page,
      pageSize,
      name: searchTerm,
    }),
  staleTime: 1000 * 60 * 30,
  gcTime: 1000 * 60 * 60,
});

export const useCharacters = ({
  page,
  pageSize,
  searchTerm,
}: {
  page: number;
  pageSize: number;
  searchTerm: string;
}) =>
  useQuery(
    charactersQueryOptions({
      page,
      pageSize,
      searchTerm,
    }),
  );

export const useCharacter = (characterId: number | null) =>
  useQuery({
    queryKey: ["character", characterId],
    queryFn: () => fetchCharacterById(characterId as number),
    enabled: !!characterId,
    staleTime: 1000 * 60 * 30,
    gcTime: 1000 * 60 * 60,
  });
