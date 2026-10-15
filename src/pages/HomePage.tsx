import { AppBar, Button, Container, Skeleton, Stack, Toolbar, Typography } from "@mui/material";
import { CardGrid, StatusCard, mobile } from "../components/layout";
import { useEffect, useMemo, useState } from "react";
import { Link } from "react-router-dom";

import { HeroCard } from "../components/HeroCard";
import { SearchBar } from "../components/SearchBar";
import { useCharacters } from "../hooks/useCharacters";
import { useDebounce } from "../hooks/useDebounce";

const PAGE_SIZE = 24;
const FAVORITES_STORAGE_KEY = "disney-favorites";

const readFavoriteIds = () => {
  try {
    const storedValue = window.localStorage.getItem(FAVORITES_STORAGE_KEY);
    return storedValue ? (JSON.parse(storedValue) as number[]) : [];
  } catch {
    return [];
  }
};

export const HomePage = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState(1);
  const [showFavoritesOnly, setShowFavoritesOnly] = useState(false);
  const [favoriteIds, setFavoriteIds] = useState<number[]>(readFavoriteIds);

  const debouncedSearch = useDebounce(searchTerm, 350);
  const { data, isLoading, isFetching, error } = useCharacters({
    page,
    pageSize: PAGE_SIZE,
    searchTerm: debouncedSearch,
  });

  useEffect(() => {
    window.localStorage.setItem(
      FAVORITES_STORAGE_KEY,
      JSON.stringify(favoriteIds),
    );
  }, [favoriteIds]);

  useEffect(() => {
    setPage(1);
  }, [debouncedSearch]);

  const characters = useMemo(() => data?.data ?? [], [data]);
  const totalPages = data?.info.totalPages ?? 1;

  const visibleCharacters = useMemo(() => {
    const favoriteFiltered = showFavoritesOnly
      ? characters.filter((character) => favoriteIds.includes(character._id))
      : characters;

    return favoriteFiltered;
  }, [characters, favoriteIds, showFavoritesOnly]);

  const toggleFavorite = (characterId: number) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(characterId)
        ? currentIds.filter((id) => id !== characterId)
        : [...currentIds, characterId],
    );
  };

  const isEmptyState = !isLoading && !error && visibleCharacters.length === 0;
  const errorMessage =
    error instanceof Error
      ? error.message
      : "Something went wrong while loading Disney characters.";

  return (
    <>
      <AppBar position="static" color="inherit" elevation={0} sx={{ borderBottom: 1, borderColor: "divider" }}>
        <Container>
          <Toolbar disableGutters sx={{ gap: 2, py: 1, flexWrap: "wrap" }}>
            <Typography variant="h6" component="h1" sx={{ flexGrow: 1 }}>
              Disney Character Explorer
            </Typography>
            <Button
              variant="outlined"
              onClick={() => setShowFavoritesOnly((currentValue) => !currentValue)}
            >
              {showFavoritesOnly
                ? "Show all characters"
                : `Favorites (${favoriteIds.length})`}
            </Button>
          </Toolbar>
        </Container>
      </AppBar>

      <Container component="section" sx={{ py: 3 }} aria-label="Character search">
        <Stack direction={{ xs: "column", sm: "row" }} spacing={2} sx={{ alignItems: { sm: "center" } }}>
          <SearchBar
            value={searchTerm}
            onChange={setSearchTerm}
            onClear={() => setSearchTerm("")}
            isLoading={isLoading || isFetching}
          />
          <Button component={Link} to="/character/4703" variant="text" sx={{ flexShrink: 0 }}>
            Spotlight: Mickey Mouse
          </Button>
        </Stack>
      </Container>

      <Container component="section" sx={{ pt: 1, pb: 4 }} aria-live="polite">
        {isLoading && !data ? (
          <CardGrid
            aria-label="Loading Disney characters"
          >
            {Array.from({ length: 8 }).map((_, index) => (
              <Skeleton key={`loading-card-${index}`} variant="rounded" height={360} />
            ))}
          </CardGrid>
        ) : null}

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

            <Stack direction="row" sx={{
              alignItems: "center",
              justifyContent: "center",
              gap: 2,
              mt: 3,
              flexWrap: "wrap",
              [mobile]: { justifyContent: "flex-start" }
            }}>
              <Button
                type="button"
                variant="outlined"
                onClick={() =>
                  setPage((currentPage) => Math.max(1, currentPage - 1))
                }
                disabled={page === 1 || isFetching}
              >
                Previous
              </Button>
              <Typography variant="body2" component="span" color="text.secondary">
                Page {page} of {totalPages}
              </Typography>
              <Button
                type="button"
                variant="contained"
                onClick={() => setPage((currentPage) => currentPage + 1)}
                disabled={page >= totalPages || isFetching}
              >
                Next
              </Button>
            </Stack>
          </>
        ) : null}

        {error ? (
          <StatusCard>
            <Typography variant="h6" component="h2" gutterBottom>Unable to load Disney characters</Typography>
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

        {isEmptyState ? (
          <StatusCard>
            <Typography variant="h6" component="h2" gutterBottom>No matching Disney characters were found</Typography>
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
