import { Box, Button, CardMedia, Chip, Skeleton, Stack, Typography } from "@mui/material";
import { CharacterDetail, PageShell, StatusCard } from "../components/layout";
import { Link, useParams } from "react-router-dom";

import { useCharacter } from "../hooks/useCharacters";
import type { DisneyCharacter } from "../types/disney";

const getImageUrl = (character: DisneyCharacter) => {
  if (character.imageUrl) {
    return character.imageUrl;
  }

  return "https://placehold.co/900x1200/0f172a/e2e8f0?text=No+Image";
};

const categorySections = [
  { label: "Films", values: (character: DisneyCharacter) => character.films },
  {
    label: "Short films",
    values: (character: DisneyCharacter) => character.shortFilms,
  },
  {
    label: "TV shows",
    values: (character: DisneyCharacter) => character.tvShows,
  },
  {
    label: "Video games",
    values: (character: DisneyCharacter) => character.videoGames,
  },
  {
    label: "Park attractions",
    values: (character: DisneyCharacter) => character.parkAttractions,
  },
  { label: "Allies", values: (character: DisneyCharacter) => character.allies },
  {
    label: "Enemies",
    values: (character: DisneyCharacter) => character.enemies,
  },
] as const;

export const CharacterPage = () => {
  const { id } = useParams();
  const characterId = id ? Number.parseInt(id, 10) : null;
  const { data, isLoading, error } = useCharacter(characterId);

  if (isLoading) {
    return (
      <PageShell component="main">
        <Skeleton
          variant="rounded"
          height={500}
          aria-label="Loading character details"
        />
      </PageShell>
    );
  }

  if (error || !data) {
    return (
      <PageShell component="main">
        <StatusCard>
          <Typography variant="h6" component="h2" gutterBottom>We could not load this character</Typography>
          <Typography sx={{ mb: 2 }}>
            {error instanceof Error
              ? error.message
              : "Please try again in a moment."}
          </Typography>
          <Button component={Link} to="/" variant="contained">
            Back to directory
          </Button>
        </StatusCard>
      </PageShell>
    );
  }

  const visibleSections = categorySections.filter(
    ({ values }) => values(data).length > 0,
  );

  return (
    <PageShell component="main">
      <Button component={Link} to="/" variant="text" sx={{ mb: 2 }}>
        ← Back to directory
      </Button>

      <CharacterDetail component="article">
        <CardMedia component="img" image={getImageUrl(data)} alt={data.name} sx={{ width: "100%", height: "100%", minHeight: 440, objectFit: "cover", borderRadius: 1 }} />

        <Stack sx={{ justifyContent: "center" }}>
          <Typography variant="subtitle2" component="p" color="text.secondary" gutterBottom>Character spotlight</Typography>
          <Typography variant="h4" component="h1">{data.name}</Typography>

          <Stack direction="row" sx={{ gap: 1, mt: 2, flexWrap: "wrap" }}>
            <Chip label={`${data.films.length} films`} />
            <Chip label={`${data.tvShows.length} shows`} />
            <Chip label={`${data.videoGames.length} games`} />
          </Stack>

          <Box sx={{
            display: "grid",
            gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            gap: 3,
            mt: 3
          }}>
            {visibleSections.map(({ label, values }) => (
              <Box component="section" key={label}>
                <Typography variant="subtitle1" component="h2" gutterBottom>{label}</Typography>
                <Box component="ul" sx={{ m: 0, pl: 2, color: "text.secondary", typography: "body2" }}>
                  {values(data)
                    .slice(0, 8)
                    .map((item) => (
                      <li key={`${label}-${item}`}>{item}</li>
                    ))}
                </Box>
              </Box>
            ))}
          </Box>

          {data.url ? (
            <Stack direction="row" sx={{ gap: 1, mt: 3, flexWrap: "wrap" }}>
              <Button href={data.url} target="_blank" rel="noreferrer" variant="outlined">
                Disney API record
              </Button>
            </Stack>
          ) : null}
        </Stack>
      </CharacterDetail>
    </PageShell>
  );
};
