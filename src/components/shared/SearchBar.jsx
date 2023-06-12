import { Search } from "@mui/icons-material";
import { Box, Input } from "@mui/material";

// Data

const SearchBar = ({ handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit}>
      <Box className="rounded-full px-2 py-1 bg-white w-[220px] flex items-center shadow-md">
        <Search sx={{ fontSize: "1.2rem", mr: 1 }} />
        <Input
          // sx={{ fontSize: ".9rem", border: "none", py: 0, width: "15vw" }}
          disableUnderline={true}
          name="search"
          placeholder="Search for"
          className="flex-1"
        />
      </Box>
    </form>
  );
};

export default SearchBar;
