import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, useParams } from 'react-router-dom';
import { listServices } from "./../../services/servicoService";
import { listCustomers } from "./../../services/clienteService";
import { createQuote, getQuoteById, updateQuote } from '../../services/orcamentoService';
import { Box, Typography, TextField, Button, Paper, Grid, FormControl, InputLabel, MenuItem, Select, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, IconButton } from '@mui/material';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import Navigation from '../../components/Navigation';
import { Customer, QuoteItem, Service } from '../../models/types';

const CreateQuote = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const isEditMode = !!id;

  const [customers, setCustomers] = useState<Customer[]>([]);
  const [services, setServices] = useState<Service[]>([]);
  const [customerId, setCustomerId] = useState('');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);
  const addItem = () => {
    if (services.length > 0) {
      setItems([...items, { servico: services[0], quantidade: 1 }]);
    }
  };

  const loadServices = async () => {
    const lista = await listServices();
    setServices(lista || []);
  };

  const loadCustomers = async () => {
    const lista = await listCustomers();
    setCustomers(lista || []);
  };

  const loadQuote = async () => {
    if (!id) return;
    const quote = await getQuoteById(id);
    if (quote) {
      setDate(quote.date);
      setCustomerId(quote.customerId);
      setItems(quote.items);
      setNotes(quote.notes);
    }
  };

  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const service = services.find(s => s.id === item.servico.id);
      return total + (service ? service.price * item.quantidade : 0);
    }, 0);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const handleItemChange = (index: number, field: 'service.id' | 'quantidade', value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const quoteData = { customerId, date, items, notes, status: 'rascunho', total: calculateTotal() };

    if (isEditMode && id) {
      await updateQuote(id, quoteData.customerId, quoteData.date, quoteData.items, quoteData.notes, quoteData.status);
    } else {
      await createQuote(customerId, date, items, notes);
    }

    navigate('/quotes', { state: { refresh: true } });
  };

  useEffect(() => {
    loadServices();
    loadCustomers();
    if (isEditMode) {
      loadQuote();
    } 
  }, [isEditMode]);

  useEffect(() => {
    if (items.length === 0 && services.length > 0) {
      addItem();
    }
  }, [items.length, addItem]); 

  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1">
          {isEditMode ? "Editar Orçamento" : "Criar Novo Orçamento"}
        </Typography>
        <Paper>
          <form onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <FormControl fullWidth>
                  <InputLabel>Cliente</InputLabel>
                  <Select value={customerId} onChange={(e) => setCustomerId(e.target.value as string)}>
                    {customers.map((customer) => (
                      <MenuItem key={customer.id} value={customer.id}>
                        {customer.name} - {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6}>
                <TextField fullWidth label="Data" type="date" value={date} onChange={(e) => setDate(e.target.value)} InputLabelProps={{ shrink: true }} />
              </Grid>
              <Grid item xs={12}>
                <Button startIcon={<AddIcon />} onClick={addItem} variant="outlined" size="small">
                  Adicionar Serviço
                </Button>
                <TableContainer>
                  <Table>
                    <TableHead>
                      <TableRow>
                        <TableCell>Serviço</TableCell>
                        <TableCell>Preço</TableCell>
                        <TableCell>Quantidade</TableCell>
                        <TableCell>Subtotal</TableCell>
                        <TableCell>Ações</TableCell>
                      </TableRow>
                    </TableHead>
                    <TableBody>
                      {items.map((item, index) => (
                        <TableRow key={index}>
                          <TableCell>
                            <Select value={item.servico.id} onChange={(e) => handleItemChange(index, 'service.id', e.target.value)}>
                              {services.map((service) => (
                                <MenuItem key={service.id} value={service.id}>{service.name}</MenuItem>
                              ))}
                            </Select>
                          </TableCell>
                          <TableCell>{item.precoUnitario}</TableCell>
                          <TableCell>
                            <TextField type="number" value={item.quantidade} onChange={(e) => handleItemChange(index, 'quantidade', parseInt(e.target.value) || 1)} />
                          </TableCell>
                          <TableCell>{item.precoUnitario! * item.quantidade}</TableCell>
                          <TableCell>
                            <IconButton onClick={() => removeItem(index)}><DeleteIcon /></IconButton>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </TableContainer>
              </Grid>
              <Grid item xs={12}>
               <TextField
                 fullWidth
                 label="Notas"
                 multiline
                 rows={4}
                 value={notes}
                 onChange={(e) => setNotes(e.target.value)}
               />
             </Grid>
             
             <Grid item xs={12}>
               <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                 <Typography variant="h6" sx={{ mr: 2 }}>
                   Total: {formatCurrency(calculateTotal())}
                 </Typography>
               </Box>
             </Grid>
            </Grid>
            <Button variant="outlined" onClick={() => navigate('/quotes')}>Cancelar</Button>
            <Button type="submit" variant="contained">{isEditMode ? "Salvar Alterações" : "Criar Orçamento"}</Button>
          </form>
        </Paper>
      </Box>
    </>
  );
};

export default CreateQuote;
