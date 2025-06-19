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
import { debounce } from 'lodash';

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

interface Category {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  updatedAt: string;
  parent?: Category;
}

interface Product {
  id: string;
  title: string;
  description: string | null;
  provider: string;
  categoryId: string;
  price: number;
  link: string;
  image: string;
  createdAt: string;
  updatedAt: string;
  category: Category;
}

function priceFormatter(price: number) {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(price);
}

export function Search({ onSearch }: { onSearch: (query: string) => void }) {
  const [searchQuery, setSearchQuery] = React.useState('');

  // Cria uma versão debounced da função onSearch
  const debouncedSearch = React.useMemo(
    () => debounce((query: string) => onSearch(query), 300),
    [onSearch]
  );

  // Limpa o debounce quando o componente é desmontado
  React.useEffect(() => {
    return () => {
      debouncedSearch.cancel();
    };
  }, [debouncedSearch]);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const query = event.target.value;
    setSearchQuery(query);
    debouncedSearch(query); // Chama a função debounced
  };

  return (
    <FormControl sx={{ width: { xs: '100%', md: '35ch' } }} variant="outlined">
      <OutlinedInput
        size="small"
        id="search"
        placeholder="Buscar..."
        value={searchQuery}
        onChange={handleInputChange}
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
  const [selectedCategory, setSelectedCategory] = React.useState<string | null>(
    null
  );
  const [searchQuery, setSearchQuery] = React.useState<string>('');
  const navigate = useNavigate();
  const { user } = useAuth();
  const [products, setProducts] = React.useState<Product[]>([]);
  const [allProducts, setAllProducts] = React.useState<Product[]>([]); // Armazena todos os produtos

  // Busca todos os produtos
  const handleShowProducts = async () => {
    try {
      const data = user
        ? await ProductService.getAll()
        : await ProductService.home();
      setProducts(data);
      setAllProducts(data); // Armazena todos os produtos para filtro
    } catch (error) {
      console.error('Erro ao buscar produtos:', error);
    }
  };

  React.useEffect(() => {
    handleShowProducts();
  }, [user]);

  // Aplica filtros de categoria e busca
  React.useEffect(() => {
    let filteredProducts = [...allProducts];

    // Filtro de categoria
    if (selectedCategory && selectedCategory !== 'novidades') {
      filteredProducts = filteredProducts.filter(
        (product) =>
          (product.category.parent?.name.toLowerCase() ||
            product.category.name.toLowerCase()) === selectedCategory
      );
    }

    // Filtro de busca
    if (searchQuery) {
      const queryLower = searchQuery.toLowerCase();
      filteredProducts = filteredProducts.filter(
        (product) =>
          product.title.toLowerCase().includes(queryLower) ||
          (product.description &&
            product.description.toLowerCase().includes(queryLower)) ||
          product.category.name.toLowerCase().includes(queryLower)
      );
    }

    setProducts(filteredProducts);
  }, [selectedCategory, searchQuery, allProducts]);

  const handleFocus = (index: number) => {
    setFocusedCardIndex(index);
  };

  const handleBlur = () => {
    setFocusedCardIndex(null);
  };

  // Filtra produtos por categoria no frontend
  const handleClick = (category: string) => {
    const categoryLower = category.toLowerCase();
    if (selectedCategory === categoryLower) {
      // Desmarcar categoria e mostrar todos os produtos (sujeito à busca)
      setSelectedCategory(null);
    } else {
      // Selecionar categoria
      setSelectedCategory(categoryLower);
    }
  };

  // Manipula a busca
  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  // Lista de categorias
  const categories = [
    'Eletrônicos',
    'Eletrodomésticos',
    'Moda',
    'Móveis',
    'Cozinha',
    'Livros',
    'Esporte',
  ];

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
        {user && (
          <Box display="flex" flexDirection="column" gap={2} mt={4}>
            <Search onSearch={handleSearch} />
          </Box>
        )}
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
          {user &&
            categories.map((category) => (
              <Chip
                key={category}
                onClick={() => handleClick(category)}
                size="medium"
                label={category}
                variant={
                  selectedCategory === category.toLowerCase()
                    ? 'filled'
                    : 'outlined'
                }
                color={
                  selectedCategory === category.toLowerCase()
                    ? 'primary'
                    : 'default'
                }
                sx={{
                  backgroundColor:
                    selectedCategory === category.toLowerCase()
                      ? undefined
                      : 'transparent',
                  border:
                    selectedCategory === category.toLowerCase()
                      ? undefined
                      : 'none',
                }}
              />
            ))}
        </Box>
      </Box>
      <Grid container spacing={2} columns={16}>
        {products?.map((product) => (
          <Grid
            size={{ xs: 16, md: 4 }}
            onClick={() => window.open(product.link, '_blank')}
            key={product.id}
          >
            <SyledCard
              variant="outlined"
              onFocus={() => handleFocus(0)}
              onBlur={handleBlur}
              tabIndex={0}
              className={focusedCardIndex === 0 ? 'Mui-focused' : ''}
            >
              <CardMedia
                component="img"
                image={product.image}
                sx={{
                  aspectRatio: '16 / 9',
                  borderBottom: '1px solid',
                  borderColor: 'divider',
                }}
              />
              <SyledCardContent>
                <Typography variant="h6">
                  {priceFormatter(product.price)}
                </Typography>
                <Typography gutterBottom variant="subtitle2" component="div">
                  {product.title}
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
