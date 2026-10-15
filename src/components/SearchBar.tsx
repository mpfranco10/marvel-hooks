import {
  CircularProgress,
  IconButton,
  InputAdornment,
  TextField,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";

type SearchBarProps = {
  value: string;
  isLoading: boolean;
  onChange: (value: string) => void;
  onClear: () => void;
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
    sx={{
      // Hide native search clear button
      "& input[type='search']::-webkit-search-cancel-button": {
        display: "none",
      },
    }}
    slotProps={{
      root: { role: "search" },
      input: {
        endAdornment: (
          <InputAdornment position="end">
            {isLoading && <CircularProgress size={18} />}

            {value && (
              <IconButton
                size="small"
                onClick={onClear}
                aria-label="Clear search"
              >
                <CloseIcon fontSize="small" />
              </IconButton>
            )}
          </InputAdornment>
        ),
      },
    }}
  />
);
