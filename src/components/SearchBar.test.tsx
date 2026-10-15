import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, expect, it, vi } from "vitest";

import { SearchBar } from "./SearchBar";

describe("SearchBar", () => {
  it("updates the search field and clears the value", async () => {
    const user = userEvent.setup();
    const onChange = vi.fn();
    const onClear = vi.fn();

    const { rerender } = render(
      <SearchBar
        value=""
        onChange={onChange}
        onClear={onClear}
        isLoading={false}
      />,
    );

    const input = screen.getByLabelText(/search disney characters/i);
    await user.type(input, "mickey");

    expect(onChange).toHaveBeenCalled();

    rerender(
      <SearchBar
        value="mickey"
        onChange={onChange}
        onClear={onClear}
        isLoading={false}
      />,
    );

    const clearButton = screen.getByRole("button", { name: /clear/i });
    await user.click(clearButton);

    expect(onClear).toHaveBeenCalledTimes(1);
  });
});
