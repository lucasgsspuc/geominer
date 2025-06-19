import * as React from 'react';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';
import AppAppBar from '../components/AppAppBar';
import Footer from '../components/Footer';

const StyledAccordion = styled(Accordion)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  border: `1px solid ${(theme.vars || theme).palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&:before': {
    display: 'none',
  },
  '&.Mui-expanded': {
    margin: 0,
  },
}));

const StyledAccordionSummary = styled(AccordionSummary)(({ theme }) => ({
  backgroundColor: (theme.vars || theme).palette.background.paper,
  padding: theme.spacing(2),
  '& .MuiAccordionSummary-content': {
    margin: 0,
  },
}));

const StyledAccordionDetails = styled(AccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: `1px solid ${(theme.vars || theme).palette.divider}`,
}));

interface FAQItem {
  question: string;
  answer: string;
}

const faqs: FAQItem[] = [
  {
    question: 'O que é esta plataforma?',
    answer:
      'Nossa plataforma ajuda você a descobrir produtos em alta para impulsionar suas vendas, com ferramentas de busca, filtros por categoria e relatórios detalhados.',
  },
  {
    question: 'Quais são os planos disponíveis?',
    answer:
      'Oferecemos três planos: Gratuito (acesso básico), Pro (recursos avançados para pequenas empresas) e Empresarial (soluções completas com suporte 24/7). Veja detalhes na página de Preços.',
  },
  {
    question: 'Como funciona a busca de produtos?',
    answer:
      'Você pode buscar produtos por palavras-chave no título, descrição ou categoria. Use os filtros de categoria para refinar os resultados e encontrar exatamente o que precisa.',
  },
  {
    question: 'Posso usar a plataforma sem me registrar?',
    answer:
      'Sim, o plano Gratuito permite explorar a plataforma sem registro, mas algumas funcionalidades avançadas exigem uma conta registrada.',
  },
  {
    question: 'Como posso entrar em contato com o suporte?',
    answer:
      'Para o plano Gratuito, oferecemos suporte por e-mail. Nos planos Pro e Empresarial, você tem acesso a suporte prioritário e, no Empresarial, suporte 24/7.',
  },
  {
    question: 'Posso cancelar meu plano pago a qualquer momento?',
    answer:
      'Sim, os planos pagos podem ser cancelados a qualquer momento. Entre em contato com o suporte para mais detalhes sobre o processo de cancelamento.',
  },
];

export default function FAQ() {
  const [expanded, setExpanded] = React.useState<string | false>(false);

  const handleChange =
    (panel: string) => (event: React.SyntheticEvent, isExpanded: boolean) => {
      setExpanded(isExpanded ? panel : false);
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
              Perguntas Frequentes
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Encontre respostas para as dúvidas mais comuns sobre nossa
              plataforma.
            </Typography>
          </Box>
          <Box sx={{ maxWidth: 800, mx: 'auto' }}>
            {faqs.map((faq, index) => (
              <StyledAccordion
                key={index}
                expanded={expanded === `panel${index}`}
                onChange={handleChange(`panel${index}`)}
              >
                <StyledAccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls={`panel${index}-content`}
                  id={`panel${index}-header`}
                >
                  <Typography variant="h6">{faq.question}</Typography>
                </StyledAccordionSummary>
                <StyledAccordionDetails>
                  <Typography variant="body2" color="text.secondary">
                    {faq.answer}
                  </Typography>
                </StyledAccordionDetails>
              </StyledAccordion>
            ))}
          </Box>
        </Container>
      </Container>
      <Footer />
    </>
  );
}
