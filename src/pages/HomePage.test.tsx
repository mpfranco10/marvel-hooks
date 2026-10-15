import { cleanup, render, screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { ThemeProvider } from "@mui/material";
import { MemoryRouter, Route, Routes } from "react-router-dom";
import { afterEach, expect, it, vi } from "vitest";

import { theme } from "../theme";
import { HomePage } from "./HomePage";
import { CharacterPage } from "./CharacterPage";
import type { DisneyCharacter } from "../types/disney";

const character: DisneyCharacter = {
  _id: 4703,
  name: "Mickey Mouse",
  films: ["Fantasia"],
  shortFilms: [],
  tvShows: [],
  videoGames: [],
  parkAttractions: [],
  allies: [],
  enemies: [],
  url: "https://api.disneyapi.dev/characters/4703",
};
const query = vi.hoisted(() => ({ page: 1, searchTerm: "" }));
vi.mock("../hooks/useCharacters", () => ({
  useCharacters: (params: { page: number; searchTerm: string }) => {
    Object.assign(query, params);
    return {
      data: { data: [character], info: { totalPages: 2 } },
      isLoading: false,
      isFetching: false,
      error: null
    };
  },
  useCharacter: () => ({ data: character, isLoading: false, error: null }),
}));
afterEach(() => { cleanup(); window.localStorage.clear(); });

it("preserves favorites, pagination, debounced search, clearing, and profile navigation", async () => {
  const user = userEvent.setup();
  render(
    <ThemeProvider theme={theme}>
      <MemoryRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/character/:id" element={<CharacterPage />} />
        </Routes>
      </MemoryRouter>
    </ThemeProvider>,
  );
  await user.click(screen.getByRole("button", { name: "Add Mickey Mouse to favorites" }));
  expect(window.localStorage.getItem("disney-favorites")).toBe("[4703]");
  await user.click(screen.getByRole("button", { name: "Favorites (1)" }));
  expect(screen.getByRole("heading", { name: "Mickey Mouse" })).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Remove Mickey Mouse from favorites" }));
  expect(screen.getByText("No matching Disney characters were found")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Show all characters" }));
  await user.click(screen.getByRole("button", { name: "Next" }));
  expect(screen.getByText("Page 2 of 2")).toBeInTheDocument();
  expect(query.page).toBe(2);
  await user.type(screen.getByRole("searchbox"), "mickey");
  await waitFor(() => expect(query.searchTerm).toBe("mickey"));
  expect(screen.getByText("Page 1 of 2")).toBeInTheDocument();
  await user.click(screen.getByRole("button", { name: "Clear" }));
  await waitFor(() => expect(query.searchTerm).toBe(""));
  await user.click(screen.getByRole("button", { name: "Open Mickey Mouse profile" }));
  expect(screen.getByRole("heading", { level: 1, name: "Mickey Mouse" })).toBeInTheDocument();
  expect(screen.getByText("Fantasia")).toBeInTheDocument();
  await user.click(screen.getByRole("link", { name: /Back to directory/ }));
  expect(screen.getByRole("searchbox")).toBeInTheDocument();
});
