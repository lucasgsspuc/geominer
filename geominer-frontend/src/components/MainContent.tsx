import * as React from 'react';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Chip from '@mui/material/Chip';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import FormControl from '@mui/material/FormControl';
import InputAdornment from '@mui/material/InputAdornment';
import OutlinedInput from '@mui/material/OutlinedInput';
import { styled } from '@mui/material/styles';
import SearchRoundedIcon from '@mui/icons-material/SearchRounded';
import { Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { ProductService } from '../services/ProductService';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  '&:hover': {
    backgroundColor: 'transparent',
    cursor: 'pointer',
  },
  '&:focus-visible': {
    outline: '3px solid',
    outlineColor: 'hsla(210, 98%, 48%, 0.5)',
    outlineOffset: '2px',
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 4,
  padding: 16,
  flexGrow: 1,
  '&:last-child': {
    paddingBottom: 16,
  },
});

const StyledTypography = styled(Typography)({
  display: '-webkit-box',
  WebkitBoxOrient: 'vertical',
  WebkitLineClamp: 2,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
});

function priceFormatter(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function Search() {
  return (
    <FormControl sx={{ width: { xs: '100%', md: '35ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Buscar..."
        sx={{ flexGrow: 1 }}
        startAdornment={
          <InputAdornment position="start" sx={{ color: 'text.primary' }}>
            <SearchRoundedIcon fontSize="small" />
          </InputAdornment>
        }
        inputProps={{
          'aria-label': 'search',
        }}
      />
    </FormControl>
  );
}

export default function MainContent() {
  const [focusedCardIndex, setFocusedCardIndex] = React.useState<number | null>(
    null
  );
  const navigate = useNavigate();
  const { user } = useAuth();
  const [properties, setProperties] = React.useState<any[]>([]);

  const handleShowProperties = async () => {
    try {
      const data = user
        ? await ProductService.getAll()
        : await ProductService.home();
      setProperties(data);
    } catch (error) {}
  };

  React.useEffect(() => {
    handleShowProperties();
  }, [user]);

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  const handleClick = () => {
    console.info('You clicked the filter chip.');
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        justifyContent="center"
        alignItems="center"
        minHeight="20vh"
      >
        <Typography variant="h1" gutterBottom>
          Saiba o que seus clientes mais desejam
        </Typography>
        <Typography>
          Encontre os produtos que estão em alta e transforme cada oportunidade
          em mais vendas para o seu negócio.
        </Typography>
        <Box display="flex" flexDirection="column" gap={2} mt={4}>
          <Search />
        </Box>
      </Box>

      <Box
        sx={{
          display: 'flex',
          flexDirection: { xs: 'column-reverse', md: 'row' },
          width: '100%',
          justifyContent: 'space-between',
          alignItems: { xs: 'start', md: 'center' },
          gap: 4,
          overflow: 'auto',
        }}
      >
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            gap: 3,
            overflow: 'auto',
          }}
        >
          <Chip onClick={handleClick} size="medium" label="Novidades" />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Eletrônicos"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Moda"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
          <Chip
            onClick={handleClick}
            size="medium"
            label="Móveis"
            sx={{
              backgroundColor: 'transparent',
              border: 'none',
            }}
          />
        </Box>
      </Box>
      <Grid container spacing={2} columns={16}>
        {properties?.map((property) => (
          <Grid size={{ xs: 16, md: 4 }} key={property.id}>
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
            >
              <CardMedia
                component="img"
                image={property.image}
                sx={{
                  aspectRatio: '16 / 9',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <SyledCardContent>
                <Typography variant="h6">
                  {priceFormatter(property.price)}
                </Typography>

                <Typography gutterBottom variant="subtitle2" component="div">
                  {property.title}
                </Typography>
              </SyledCardContent>
            </SyledCard>
          </Grid>
        ))}
      </Grid>

      {!user && (
        <Box display="flex" justifyContent="center" alignItems="center">
          <Button
            variant="contained"
            color="primary"
            size="large"
            onClick={() => {
              if (user) console.log('Ver mais');
              else navigate('/login');
            }}
          >
            Ver mais
          </Button>
        </Box>
      )}
    </Box>
  );
}
