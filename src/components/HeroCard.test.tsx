import { cleanup, render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";

import { HeroCard } from "./HeroCard";
import type { DisneyCharacter } from "../types/disney";

const character: DisneyCharacter = {
  _id: 4703, name: "Mickey Mouse", films: ["Fantasia"], shortFilms: [],
  tvShows: [], videoGames: [], parkAttractions: [], allies: [], enemies: [], url: "",
};

afterEach(cleanup);

const renderCard = () => {
  const onToggleFavorite = vi.fn();
  render(
    <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
      <Routes>
        <Route path="/" element={<HeroCard character={character} isFavorite={false} onToggleFavorite={onToggleFavorite} />} />
        <Route path="/character/4703" element={<h1>Character profile</h1>} />
      </Routes>
    </MemoryRouter>,
  );
  return onToggleFavorite;
};

it.each(["image", "name", "secondary text"])("opens the profile by clicking the card's %s", async (area) => {
  const user = userEvent.setup();
  renderCard();
  const target = area === "image" ? screen.getByRole("img")
    : screen.getByText(area === "name" ? "Mickey Mouse" : "Fantasia");
  await user.click(target);
  expect(screen.getByRole("heading", { name: "Character profile" })).toBeInTheDocument();
});

it.each(["{Enter}", " "])("opens a focused card with %s", async (key) => {
  const user = userEvent.setup();
  renderCard();
  await user.tab();
  expect(screen.getByRole("button", { name: "Open Mickey Mouse profile" })).toHaveFocus();
  await user.keyboard(key);
  expect(screen.getByRole("heading", { name: "Character profile" })).toBeInTheDocument();
});

it("keeps pointer and keyboard favorite actions separate from navigation", async () => {
  const user = userEvent.setup();
  const toggle = renderCard();
  const favorite = screen.getByRole("button", { name: "Add Mickey Mouse to favorites" });
  await user.click(favorite);
  expect(toggle).toHaveBeenCalledWith(4703);
  expect(screen.getByRole("button", { name: "Open Mickey Mouse profile" })).toBeInTheDocument();
  favorite.focus();
  await user.keyboard(" ");
  expect(toggle).toHaveBeenCalledTimes(2);
  expect(screen.queryByRole("heading", { name: "Character profile" })).not.toBeInTheDocument();
});
