import { Card, CardActionArea, CardContent, CardMedia, Typography, IconButton, SvgIcon } from "@mui/material";
import { useNavigate } from "react-router-dom";

import type { DisneyCharacter } from "../types/disney";

type HeroCardProps = {
  character: DisneyCharacter;
  isFavorite: boolean;
  onToggleFavorite: (characterId: number) => void;
};

const getCategoryLabel = (character: DisneyCharacter) => {
  const categories = [
    character.films,
    character.tvShows,
    character.videoGames,
    character.parkAttractions,
  ];

  const firstAvailable = categories
    .flat()
    .find((entry) => Boolean(entry?.trim()));

  return firstAvailable || "Disney character";
};

const getImageUrl = (character: DisneyCharacter) => {
  if (character.imageUrl) {
    return character.imageUrl;
  }

  return "https://placehold.co/900x1200/0f172a/e2e8f0?text=No+Image";
};

export const HeroCard = ({
  character,
  isFavorite,
  onToggleFavorite,
}: HeroCardProps) => {
  const navigate = useNavigate();

  return (
    <Card component="article" variant="outlined" sx={{ position: "relative", height: "100%" }}>
      <CardActionArea
        onClick={() => navigate(`/character/${character._id}`)}
        aria-label={`Open ${character.name} profile`}
        sx={{ display: "flex", flexDirection: "column", alignItems: "stretch", height: "100%" }}
      >
        <CardMedia
          component="img"
          src={getImageUrl(character)}
          alt={character.name}
          sx={{ aspectRatio: "4 / 5", objectFit: "cover", bgcolor: "grey.100" }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" component="h2" gutterBottom>{character.name}</Typography>
          <Typography variant="body2" color="text.secondary" gutterBottom>
            {getCategoryLabel(character)}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {character.films.length + character.tvShows.length} featured
          </Typography>
        </CardContent>
      </CardActionArea>
      <IconButton
        color={isFavorite ? "warning" : "default"}
        onClick={() => onToggleFavorite(character._id)}
        aria-label={
          isFavorite
            ? `Remove ${character.name} from favorites`
            : `Add ${character.name} to favorites`
        }
        sx={{ position: "absolute", top: 8, right: 8, bgcolor: "background.paper", "&:hover": { bgcolor: "grey.100" } }}
      >
        <SvgIcon>
          <polygon
            points="12,3 14.8,8.7 21,9.6 16.5,14 17.6,20.2 12,17.3 6.4,20.2 7.5,14 3,9.6 9.2,8.7"
            fill={isFavorite ? "currentColor" : "none"}
            stroke="currentColor"
            strokeWidth={1.5}
            strokeLinejoin="round"
          />
        </SvgIcon>
      </IconButton>
    </Card>
  );
};
