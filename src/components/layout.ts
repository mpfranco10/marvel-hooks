import { Box, Card, Container, styled } from "@mui/material";

export const mobile = "@media (max-width: 760px)";
export const PageShell = styled(Container)(({ theme }) => ({
  paddingTop: theme.spacing(3),
  paddingBottom: theme.spacing(4),
})) as typeof Container;
export const CardGrid = styled(Box)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "repeat(auto-fit, minmax(min(240px, 100%), 1fr))",
  gap: theme.spacing(2),
}));
export const StatusCard = styled(Card)(({ theme }) => ({
  maxWidth: theme.spacing(84),
  margin: theme.spacing(2, "auto", 0),
  padding: theme.spacing(3),
  textAlign: "center",
}));
export const CharacterDetail = styled(Card)(({ theme }) => ({
  display: "grid",
  gridTemplateColumns: "minmax(280px, 420px) minmax(0, 1fr)",
  gap: theme.spacing(3),
  padding: theme.spacing(2),
  [mobile]: { gridTemplateColumns: "minmax(0, 1fr)" },
})) as typeof Card;
