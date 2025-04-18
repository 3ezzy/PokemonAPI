import { useState, useEffect } from 'react';
import { Card, CardContent, CardMedia, Typography, CardActionArea, Chip, Box, Skeleton } from '@mui/material';
import { Link } from 'react-router-dom';
import { getPokemonDetails } from '../api/pokemonApi';

// Type background colors
const typeColors = {
  normal: '#A8A77A',
  fire: '#EE8130',
  water: '#6390F0',
  electric: '#F7D02C',
  grass: '#7AC74C',
  ice: '#96D9D6',
  fighting: '#C22E28',
  poison: '#A33EA1',
  ground: '#E2BF65',
  flying: '#A98FF3',
  psychic: '#F95587',
  bug: '#A6B91A',
  rock: '#B6A136',
  ghost: '#735797',
  dragon: '#6F35FC',
  dark: '#705746',
  steel: '#B7B7CE',
  fairy: '#D685AD',
};

const PokemonCard = ({ pokemon }) => {
  const [details, setDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        setLoading(true);
        // Extract ID from URL or use the provided ID
        const id = pokemon.url 
          ? pokemon.url.split('/').filter(Boolean).pop() 
          : pokemon.id || pokemon.name;
        
        const data = await getPokemonDetails(id);
        setDetails(data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching Pokemon details:', err);
        setError(err.message);
        setLoading(false);
      }
    };
    
    fetchDetails();
  }, [pokemon]);
  
  if (loading) {
    return (
      <Card className="pokemon-card">
        <Skeleton variant="rectangular" height={140} />
        <CardContent>
          <Skeleton variant="text" height={40} />
          <Skeleton variant="text" height={30} />
        </CardContent>
      </Card>
    );
  }
  
  if (error) {
    return (
      <Card className="pokemon-card">
        <CardContent>
          <Typography color="error">Error: {error}</Typography>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="pokemon-card">
      <CardActionArea component={Link} to={`/pokemon/${details.id}`}>
        <CardMedia
          component="img"
          height="140"
          image={details.sprites.other['official-artwork'].front_default || details.sprites.front_default}
          alt={details.name}
          sx={{ 
            p: 2, 
            objectFit: 'contain',
            backgroundColor: '#f5f5f5'
          }}
        />
        <CardContent>
          <Typography variant="h6" component="div" sx={{ textTransform: 'capitalize' }}>
            {details.name}
          </Typography>
          <Typography variant="caption" color="text.secondary">
            #{details.id.toString().padStart(3, '0')}
          </Typography>
          <Box sx={{ mt: 1, display: 'flex', gap: 0.5 }}>
            {details.types.map((type) => (
              <Chip 
                key={type.type.name}
                label={type.type.name}
                size="small"
                sx={{ 
                  textTransform: 'capitalize',
                  backgroundColor: typeColors[type.type.name] || '#A8A77A',
                  color: 'white'
                }}
              />
            ))}
          </Box>
        </CardContent>
      </CardActionArea>
    </Card>
  );
};

export default PokemonCard; 