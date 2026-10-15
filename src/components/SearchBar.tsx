import { Button, InputAdornment, TextField } from "@mui/material";

type SearchBarProps = {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
  isLoading: boolean;
};

export const SearchBar = ({
  value,
  onChange,
  onClear,
  isLoading,
}: SearchBarProps) => (
  <TextField
    fullWidth
    size="small"
    id="character-search"
    type="search"
    label="Search Disney characters"
    value={value}
    onChange={(event) => onChange(event.target.value)}
    slotProps={{
      root: { role: "search" },
      input: {
        endAdornment: (
          <InputAdornment position="end">
            <Button onClick={onClear} disabled={!value || isLoading}>
              Clear
            </Button>
          </InputAdornment>
        ),
      },
    }}
  />
);
