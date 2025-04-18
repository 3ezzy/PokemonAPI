import { useState } from 'react';
import { Typography, Box, Pagination, CircularProgress, Alert } from '@mui/material';
import { useQuery } from '@tanstack/react-query';
import PokemonCard from '../components/PokemonCard';
import SearchBar from '../components/SearchBar';
import { getPokemonList, getPokemonTypes, searchPokemon, getPokemonByType } from '../api/pokemonApi';

const HomePage = () => {
  const [page, setPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const limit = 20;
  const offset = (page - 1) * limit;
  
  // Fetch Pokemon types
  const typesQuery = useQuery({
    queryKey: ['pokemonTypes'],
    queryFn: () => getPokemonTypes(),
    staleTime: 24 * 60 * 60 * 1000, // 24 hours
  });
  
  // Fetch Pokemon list based on search, type filter, or paginated list
  const pokemonQuery = useQuery({
    queryKey: ['pokemonList', offset, limit, searchQuery, selectedType],
    queryFn: async () => {
      if (searchQuery) {
        return searchPokemon(searchQuery);
      }
      
      if (selectedType) {
        return getPokemonByType(selectedType);
      }
      
      return getPokemonList(limit, offset);
    },
    keepPreviousData: true,
  });
  
  const handleSearch = (query) => {
    setSearchQuery(query);
    setPage(1);
    setSelectedType('');
  };
  
  const handleTypeChange = (type) => {
    setSelectedType(type);
    setSearchQuery('');
    setPage(1);
  };
  
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  
  // Calculate total pages for pagination
  const totalPages = Math.ceil((pokemonQuery.data?.count || 0) / limit);
  
  // Format the Pokemon data based on query type
  const pokemonData = pokemonQuery.data?.results || 
    (selectedType && pokemonQuery.data?.pokemon?.map(p => p.pokemon)) || 
    [];
  
  return (
    <Box sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom sx={{ fontWeight: 700 }}>
        Pokédex
      </Typography>
      <Typography variant="body1" color="text.secondary" paragraph>
        Search for Pokémon by name or filter by type using the options below.
      </Typography>
      
      <SearchBar 
        onSearch={handleSearch} 
        types={typesQuery.data?.results || []}
        selectedType={selectedType}
        onTypeChange={handleTypeChange}
      />
      
      {pokemonQuery.isLoading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
          <CircularProgress />
        </Box>
      ) : pokemonQuery.isError ? (
        <Alert severity="error" sx={{ mt: 2 }}>
          Error loading Pokémon: {pokemonQuery.error.message}
        </Alert>
      ) : (
        <>
          {pokemonData.length === 0 ? (
            <Alert severity="info" sx={{ mt: 2 }}>
              No Pokémon found. Try a different search or filter.
            </Alert>
          ) : (
            <Box className="pokemon-grid">
              {pokemonData.map((pokemon) => (
                <PokemonCard key={pokemon.name} pokemon={pokemon} />
              ))}
            </Box>
          )}
          
          {!searchQuery && !selectedType && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination 
                count={totalPages} 
                page={page} 
                onChange={handleChangePage} 
                color="primary" 
                size="large"
              />
            </Box>
          )}
        </>
      )}
    </Box>
  );
};

export default HomePage; 