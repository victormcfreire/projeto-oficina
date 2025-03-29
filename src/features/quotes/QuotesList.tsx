
import React, { useEffect, useState } from 'react';
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
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import AddIcon from '@mui/icons-material/Add';
import Navigation from '../../components/Navigation';
import { listQuotes, deleteQuote, updateQuote } from '../../services/orcamentoService';
import { getCustomerById } from '../../services/clienteService';
import { Quote } from '../../models/types';

const QuotesList = () => {
  const [ quotes, setQuotes ] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [ quoteToDelete, setQuoteToDelete ] = useState<string | null>(null);
  const [ customers, setCustomers] = useState<{ [key: string]: any }>({});
  const [ refresh, setRefresh ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();


  useEffect(() => {
    const loadData = async () => {
      const fetchedQuotes = await listQuotes(); // Busca todos os orçamentos
      setQuotes(fetchedQuotes);

      const customerIds = Array.from(new Set<string>(fetchedQuotes.map((q: any) => q.customerId)));

      const customerData = await Promise.all(
        customerIds.map((customerId: string) => getCustomerById(customerId))
      );
      
      const customerMap = customerData.reduce((acc, customer) => {
        if (customer) acc[customer.id] = customer;
        return acc;
      }, {} as { [key: string]: any });

      setCustomers(customerMap);
    };

    if (location.state?.refresh) {
      setRefresh((prev) => !prev);
      loadData();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      loadData();
    }

  }, [refresh]);

  const loadQuotes = async () => {
    const lista = await listQuotes();
    setQuotes(lista || []);
  };

  const handleDeleteClick = (id: string) => {
    setQuoteToDelete(id);
    setDeleteDialogOpen(true);
  };

  const handleApproveClick = async (quote: Quote) => {
    if(quote.status === 'aprovado') return;
    await updateQuote(quote.id, quote.customerId, quote.date, quote.items, quote.notes, 'aprovado');
    loadQuotes();
  };

  const handlePendingClick = async (quote: Quote) => {
    if(quote.status === 'pendente') return;
    await updateQuote(quote.id, quote.customerId, quote.date, quote.items, quote.notes, 'pendente');
    loadQuotes();
  };

  const confirmDelete = () => {
    if (quoteToDelete) {
      deleteSelectedQuote(quoteToDelete);
      setDeleteDialogOpen(false);
      setQuoteToDelete(null);
    }
  };

  const deleteSelectedQuote = async (quote: string) => {
      await deleteQuote(quote);
      loadQuotes();
    };

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
    <>
      <Navigation/>
      <Box sx={{p: 3}}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" className="page-title">
            Orçamentos
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/quotes/create"
            startIcon={<AddIcon />}
          >
            Criar Orçamento
          </Button>
        </Box>

        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
              <TableCell>Cliente</TableCell>
                <TableCell>Veículo</TableCell>
                <TableCell>Data</TableCell>
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
                  const customer = customers[quote.customerId];
                  return (
                    <TableRow key={quote.id}>
                      <TableCell>{customer?.name ?? 'Desconhecido'}</TableCell>
                      <TableCell>{customer?.vehicle.model ?? 'Desconhecido'}</TableCell>
                      <TableCell>{formatDate(quote.date)}</TableCell>
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
                          to={`/quotes/edit/${quote.id}`}
                          size="small"
                          sx={{ mr: 1 }}
                        >
                          Visualizar
                        </Button>
                        <Button 
                          size="small"
                          color="success"
                          onClick={() => handleApproveClick(quote)}
                        >
                          Aprovar
                        </Button>
                        <Button 
                          size="small"
                          color="warning"
                          onClick={() => handlePendingClick(quote)}
                        >
                          Tornar Pendente
                        </Button>
                        <Button 
                          size="small"
                          color="error"
                          onClick={() => handleDeleteClick(quote.id)}
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
        <Dialog
          open={deleteDialogOpen}
          onClose={() => setDeleteDialogOpen(false)}
        >
          <DialogTitle>Confirmar Exclusão</DialogTitle>
          <DialogContent>
            <DialogContentText>
              Tem certeza que deseja deletar este serviço? Esta ação não pode ser desfeita.
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setDeleteDialogOpen(false)}>Cancelar</Button>
            <Button onClick={confirmDelete} color="error" autoFocus>
              Deletar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>
    </>
  );
};

export default QuotesList;
