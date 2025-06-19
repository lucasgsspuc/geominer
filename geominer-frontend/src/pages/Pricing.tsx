import * as React from 'react';
import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Button from '@mui/material/Button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import Footer from '../components/Footer';
import AppAppBar from '../components/AppAppBar';

const SyledCard = styled(Card)(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  padding: 0,
  height: '100%',
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: '1px solid',
  borderColor: (theme.vars || theme).palette.divider,
  '&:hover': {
    boxShadow: (theme.vars || theme).shadows[4],
  },
}));

const SyledCardContent = styled(CardContent)({
  display: 'flex',
  flexDirection: 'column',
  gap: 16,
  padding: 24,
  flexGrow: 1,
});

interface Plan {
  name: string;
  price: string;
  description: string;
  features: string[];
  buttonText: string;
  highlighted?: boolean;
}

const plans: Plan[] = [
  {
    name: 'Gratuito',
    price: 'R$ 0/mês',
    description: 'Perfeito para começar e explorar a plataforma.',
    features: [
      'Acesso a produtos limitados',
      'Busca básica',
      'Suporte por e-mail',
      'Relatórios básicos',
    ],
    buttonText: 'Começar',
  },
  {
    name: 'Pro',
    price: 'R$ 49,90/mês',
    description: 'Ideal para pequenas empresas que buscam mais recursos.',
    features: [
      'Acesso a todos os produtos',
      'Busca avançada',
      'Suporte prioritário',
      'Relatórios detalhados',
      'Integração com API',
    ],
    buttonText: 'Assinar',
    highlighted: true,
  },
  {
    name: 'Empresarial',
    price: 'R$ 199,90/mês',
    description: 'Para grandes empresas com necessidades avançadas.',
    features: [
      'Acesso completo à plataforma',
      'Busca avançada com filtros personalizados',
      'Suporte 24/7',
      'Relatórios avançados',
      'Integração com API e suporte dedicado',
    ],
    buttonText: 'Assinar',
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const navigate = useNavigate();

  const handlePlanClick = (plan: Plan) => {
    if (!user && plan.name !== 'Gratuito') {
      navigate('/login');
    } else {
      // Aqui você pode adicionar lógica para assinar o plano, ex.: redirecionar para checkout
      console.log(`Selecionado plano: ${plan.name}`);
    }
  };

  return (
    <>
      <AppAppBar />
      <Container
        maxWidth="lg"
        component="main"
        sx={{ display: 'flex', flexDirection: 'column', my: 16, gap: 4 }}
      >
        <Container maxWidth="lg" sx={{ py: 8 }}>
          <Box sx={{ textAlign: 'center', mb: 6 }}>
            <Typography variant="h1" gutterBottom>
              Escolha o plano ideal para o seu negócio
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Explore nossos planos e encontre o que melhor se adapta às suas
              necessidades.
            </Typography>
          </Box>
          <Grid container spacing={3} justifyContent="center">
            {plans.map((plan) => (
              <Grid size={{ xs: 12, sm: 6, md: 4 }} key={plan.name}>
                <SyledCard
                  sx={{
                    borderColor: plan.highlighted
                      ? (theme) => (theme.vars || theme).palette.primary.main
                      : undefined,
                    boxShadow: plan.highlighted
                      ? (theme) => (theme.vars || theme).shadows[6]
                      : undefined,
                  }}
                >
                  <SyledCardContent>
                    <Typography variant="h5" component="div">
                      {plan.name}
                    </Typography>
                    <Typography variant="h4" color="primary" gutterBottom>
                      {plan.price}
                    </Typography>
                    <Typography
                      variant="body2"
                      color="text.secondary"
                      sx={{ mb: 2 }}
                    >
                      {plan.description}
                    </Typography>
                    <Box sx={{ flexGrow: 1 }}>
                      {plan.features.map((feature, index) => (
                        <Typography key={index} variant="body2" sx={{ mb: 1 }}>
                          • {feature}
                        </Typography>
                      ))}
                    </Box>
                    <Button
                      variant={plan.highlighted ? 'contained' : 'outlined'}
                      color="primary"
                      size="large"
                      fullWidth
                      style={{ marginBottom: 20 }}
                      onClick={() => handlePlanClick(plan)}
                    >
                      {plan.buttonText}
                    </Button>
                  </SyledCardContent>
                </SyledCard>
              </Grid>
            ))}
          </Grid>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
