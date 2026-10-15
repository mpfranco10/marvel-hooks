import {
  AppBar,
  Button,
  Container,
  Skeleton,
  Stack,
  Toolbar,
  Typography,
} from "@mui/material";
import { useQueryClient } from "@tanstack/react-query";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { HeroCard } from "../components/HeroCard";
import { CardGrid, StatusCard, mobile } from "../components/layout";
import { SearchBar } from "../components/SearchBar";
import { charactersQueryOptions, useCharacters } from "../hooks/useCharacters";
import { useDebounce } from "../hooks/useDebounce";

const PAGE_SIZE = 32;
const FAVORITES_STORAGE_KEY = "disney-favorites";

/* ----------------------------------
 * Favorites
 * ---------------------------------- */

const readFavoriteIds = () => {
  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);

    return storedValue ? (JSON.parse(storedValue) as number[]) : [];
  } catch {
    return [];
  }
};

const useFavorites = () => {
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavoriteIds);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);

  useEffect(() => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteIds),
    );
  }, [favoriteIds]);

  const toggleFavorite = (characterId: number) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(characterId)
        ? currentIds.filter((id) => id !== characterId)
        : [...currentIds, characterId],
    );
  };

  const toggleFavoritesOnly = () => {
    setShowFavoritesOnly((currentValue) => !currentValue);
  };

  return {
    favoriteIds,
    showFavoritesOnly,
    toggleFavorite,
    toggleFavoritesOnly,
  };
};

/* ----------------------------------
 * Character explorer
 * ---------------------------------- */

const useCharacterExplorer = ({
  favoriteIds,
  showFavoritesOnly,
}: {
  favoriteIds: number[];
  showFavoritesOnly: boolean;
}) => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);

  const queryClient = useQueryClient();
  const debouncedSearch = useDebounce(searchTerm, 350);

  const { data, isLoading, isFetching, error } = useCharacters({
    page,
    pageSize: PAGE_SIZE,
    searchTerm: debouncedSearch,
  });

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const totalPages = data?.info.totalPages ?? 1;

  const visibleCharacters = useMemo(() => {
    const characters = data?.data ?? [];

    return showFavoritesOnly
      ? characters.filter((character) => favoriteIds.includes(character._id))
      : characters;
  }, [data, favoriteIds, showFavoritesOnly]);

  const goToPreviousPage = () => {
    setPage((currentPage) => Math.max(1, currentPage - 1));
  };

  const goToNextPage = () => {
    setPage((currentPage) => currentPage + 1);
  };

  const clearSearch = () => {
    setSearchTerm("");
  };

  const prefetchNextPage = () => {
    if (page >= totalPages) return;

    void queryClient
      .query(
        charactersQueryOptions({
          page: page + 1,
          pageSize: PAGE_SIZE,
          searchTerm: debouncedSearch,
        }),
      )
      .catch(() => {});
  };

  return {
    searchTerm,
    setSearchTerm,
    clearSearch,
    page,
    totalPages,
    visibleCharacters,
    data,
    isLoading,
    isFetching,
    error,
    goToPreviousPage,
    goToNextPage,
    prefetchNextPage,
  };
};

/* ----------------------------------
 * Home page
 * ---------------------------------- */

export const HomePage = () => {
  const {
    favoriteIds,
    showFavoritesOnly,
    toggleFavorite,
    toggleFavoritesOnly,
  } = useFavorites();

  const {
    searchTerm,
    setSearchTerm,
    clearSearch,
    page,
    totalPages,
    visibleCharacters,
    data,
    isLoading,
    isFetching,
    error,
    goToPreviousPage,
    goToNextPage,
    prefetchNextPage,
  } = useCharacterExplorer({
    favoriteIds,
    showFavoritesOnly,
  });

  const isEmptyState = !isLoading && !error && visibleCharacters.length === 0;

  const errorMessage =
    error instanceof Error
      ? error.message
      : "Something went wrong while loading Disney characters.";

  return (
    <>
      <AppBar
        position="static"
        color="inherit"
        elevation={0}
        sx={{
          borderBottom: 1,
          borderColor: "divider",
        }}
      >
        <Container>
          <Toolbar
            disableGutters
            sx={{
              gap: 2,
              py: 1,
              flexWrap: "wrap",
            }}
          >
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Disney Character Explorer
            </Typography>

            <Button variant="contained" onClick={toggleFavoritesOnly}>
              {showFavoritesOnly
                ? "Show all characters"
                : `Favorites (${favoriteIds.length})`}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container
        component="section"
        sx={{ py: 3 }}
        aria-label="Character search"
      >
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={2}
          sx={{
            alignItems: { sm: "center" },
          }}
        >
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={clearSearch}
            isLoading={isLoading || isFetching}
          />

          <Button
            component={Link}
            to="/character/4703"
            variant="contained"
            sx={{ flexShrink: 0 }}
          >
            Spotlight: Mickey Mouse
          </Button>
        </Stack>
      </Container>

      <Container
        component="section"
        sx={{
          pt: 1,
          pb: 4,
        }}
        aria-live="polite"
      >
        {/* Loading state */}

        {isLoading && !data ? (
          <CardGrid aria-label="Loading Disney characters">
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton
                key={`loading-card-${index}`}
                variant="rounded"
                height={360}
              />
            ))}
          </CardGrid>
        ) : null}

        {/* Characters */}

        {!error && !isLoading && visibleCharacters.length > 0 ? (
          <>
            <CardGrid>
              {visibleCharacters.map((character) => (
                <HeroCard
                  key={character._id}
                  character={character}
                  isFavorite={favoriteIds.includes(character._id)}
                  onToggleFavorite={toggleFavorite}
                />
              ))}
            </CardGrid>

            {/* Pagination */}

            <Stack
              direction="row"
              sx={{
                alignItems: "center",
                justifyContent: "center",
                gap: 2,
                mt: 3,
                flexWrap: "wrap",
                [mobile]: {
                  justifyContent: "flex-start",
                },
              }}
            >
              <Button
                type="button"
                variant="outlined"
                onClick={goToPreviousPage}
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>

              <Typography
                variant="body2"
                component="span"
                color="text.secondary"
              >
                Page {page} of {totalPages}
              </Typography>

              <Button
                type="button"
                variant="contained"
                onClick={goToNextPage}
                onMouseEnter={prefetchNextPage}
                disabled={page >= totalPages || isFetching}
              >
                Next
              </Button>
            </Stack>
          </>
        ) : null}

        {/* Error state */}

        {error ? (
          <StatusCard>
            <Typography variant="h6" component="h2" gutterBottom>
              Unable to load Disney characters
            </Typography>

            <Typography sx={{ mb: 2 }}>{errorMessage}</Typography>

            <Button
              type="button"
              variant="contained"
              onClick={() => window.location.reload()}
            >
              Reload page
            </Button>
          </StatusCard>
        ) : null}

        {/* Empty state */}

        {isEmptyState ? (
          <StatusCard>
            <Typography variant="h6" component="h2" gutterBottom>
              No matching Disney characters were found
            </Typography>

            <Typography sx={{ mb: 2 }}>
              Try a different search term or clear the field to continue
              browsing the collection.
            </Typography>
          </StatusCard>
        ) : null}
      </Container>
    </>
  );
};
