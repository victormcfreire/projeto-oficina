
import React from 'react';
import { 
  Box, 
  Typography, 
  Button, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  Chip
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import AddIcon from '@mui/icons-material/Add';

const QuotesList = () => {
  const { quotes, getCustomerById, deleteQuote } = useData();

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString();
  };

  // Get status color
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'rascunho': return 'default';
      case 'enviado': return 'primary';
      case 'aprovado': return 'info';
      case 'rejeitado': return 'error';
      case 'concluido': return 'success';
      default: return 'default';
    }
  };

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="page-title">
          Orçamentos
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/quotes/new"
          startIcon={<AddIcon />}
        >
          Criar Orçamento
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Orçamento #</TableCell>
              <TableCell>Data</TableCell>
              <TableCell>Cliente</TableCell>
              <TableCell>Total</TableCell>
              <TableCell>Situação</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {quotes.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} align="center">Nenhum orçamento encontrado </TableCell>
              </TableRow>
            ) : (
              quotes.map((quote) => {
                const customer = getCustomerById(quote.customerId);
                return (
                  <TableRow key={quote.id}>
                    <TableCell>{quote.id.slice(0, 8)}</TableCell>
                    <TableCell>{formatDate(quote.date)}</TableCell>
                    <TableCell>{customer?.name || 'Desconhecido'}</TableCell>
                    <TableCell>{formatCurrency(quote.total)}</TableCell>
                    <TableCell>
                      <Chip 
                        label={quote.status.charAt(0).toUpperCase() + quote.status.slice(1)} 
                        color={getStatusColor(quote.status) as any}
                        size="small"
                      />
                    </TableCell>
                    <TableCell>
                      <Button 
                        component={Link} 
                        to={`/quotes/${quote.id}`}
                        size="small"
                        sx={{ mr: 1 }}
                      >
                        Visualizar
                      </Button>
                      <Button 
                        size="small"
                        color="error"
                        onClick={() => deleteQuote(quote.id)}
                      >
                        Deletar
                      </Button>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default QuotesList;
