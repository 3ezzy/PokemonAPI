import { useState } from 'react';
import { TextField, InputAdornment, IconButton, Paper, Box, FormControl, Select, MenuItem, InputLabel } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ClearIcon from '@mui/icons-material/Clear';

const SearchBar = ({ onSearch, types = [], selectedType, onTypeChange }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch(searchTerm);
  };

  const handleClear = () => {
    setSearchTerm('');
    onSearch('');
  };

  return (
    <Paper component="form" onSubmit={handleSubmit} elevation={2} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, width: '100%', mb: 3 }}>
      <TextField
        variant="outlined"
        fullWidth
        placeholder="Search Pokémon by name..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        InputProps={{
          startAdornment: (
            <InputAdornment position="start">
              <SearchIcon color="action" />
            </InputAdornment>
          ),
          endAdornment: searchTerm && (
            <InputAdornment position="end">
              <IconButton onClick={handleClear} edge="end" size="small">
                <ClearIcon />
              </IconButton>
            </InputAdornment>
          )
        }}
        size="small"
      />

      {types.length > 0 && (
        <Box sx={{ minWidth: 120 }}>
          <FormControl fullWidth size="small">
            <InputLabel id="type-select-label">Type</InputLabel>
            <Select
              labelId="type-select-label"
              id="type-select"
              value={selectedType}
              label="Type"
              onChange={(e) => onTypeChange(e.target.value)}
            >
              <MenuItem value="">All Types</MenuItem>
              {types.map((type) => (
                <MenuItem key={type.name} value={type.name} sx={{ textTransform: 'capitalize' }}>
                  {type.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </Box>
      )}
    </Paper>
  );
};

export default SearchBar; 