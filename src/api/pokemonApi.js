import axios from 'axios';

const BASE_URL = 'https://pokeapi.co/api/v2';

// Create an axios instance
const api = axios.create({
  baseURL: BASE_URL,
});

// Get a list of Pokemon with pagination
export const getPokemonList = async (limit = 20, offset = 0) => {
  const response = await api.get(`/pokemon?limit=${limit}&offset=${offset}`);
  return response.data;
};

// Get details for a specific Pokemon
export const getPokemonDetails = async (nameOrId) => {
  const response = await api.get(`/pokemon/${nameOrId}`);
  return response.data;
};

// Get Pokemon species information
export const getPokemonSpecies = async (nameOrId) => {
  const response = await api.get(`/pokemon-species/${nameOrId}`);
  return response.data;
};

// Get Pokemon evolution chain
export const getPokemonEvolutionChain = async (url) => {
  // The URL is a full URL, so we need to use axios directly
  const response = await axios.get(url);
  return response.data;
};

// Get Pokemon types
export const getPokemonTypes = async () => {
  const response = await api.get('/type');
  return response.data;
};

// Search Pokemon by name (partially implemented - API doesn't have direct search)
export const searchPokemon = async (query) => {
  // First get a large list
  const response = await api.get('/pokemon?limit=2000');
  
  // Filter by name on the client side
  const results = response.data.results.filter(pokemon => 
    pokemon.name.toLowerCase().includes(query.toLowerCase())
  );
  
  return {
    ...response.data,
    results,
    count: results.length
  };
};

// Get Pokemon by type
export const getPokemonByType = async (type) => {
  const response = await api.get(`/type/${type}`);
  return response.data;
};

export default {
  getPokemonList,
  getPokemonDetails,
  getPokemonSpecies,
  getPokemonEvolutionChain,
  getPokemonTypes,
  searchPokemon,
  getPokemonByType,
}; 