import {
  Card,
  CardActionArea,
  CardContent,
  CardMedia,
  Typography,
  IconButton,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import StarIcon from "@mui/icons-material/Star";

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
    <Card
      component="article"
      variant="outlined"
      sx={{
        position: "relative",
        height: "100%",
        borderRadius: 4,
        cursor: "pointer",
        transition: "box-shadow 0.2s ease, transform 0.2s ease",

        "&:hover": {
          boxShadow: 4,
          transform: "translateY(-2px)",
        },

        "&:hover .character-image": {
          transform: "scale(1.03)",
          filter: "saturate(1.1) brightness(1.08)",
        },
      }}
    >
      <CardActionArea
        onClick={() => navigate(`/character/${character._id}`)}
        aria-label={`Open ${character.name} profile`}
        sx={{
          display: "flex",
          flexDirection: "column",
          alignItems: "stretch",
          height: "100%",
        }}
      >
        <CardMedia
          component="img"
          className="character-image"
          src={getImageUrl(character)}
          alt={character.name}
          sx={{
            aspectRatio: "4 / 3",
            objectFit: "cover",
            bgcolor: "grey.100",

            // ligeramente apagada normalmente
            filter: "saturate(0.85)",

            // anima el cambio
            transition: "transform 0.25s ease, filter 0.25s ease",
          }}
        />
        <CardContent sx={{ flexGrow: 1 }}>
          <Typography variant="h6" gutterBottom>
            {character.name}
          </Typography>
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
        sx={{
          position: "absolute",
          top: 8,
          right: 8,
          bgcolor: "background.paper",
          "&:hover": { bgcolor: "grey.100" },
        }}
      >
        <StarIcon />
      </IconButton>
    </Card>
  );
};
