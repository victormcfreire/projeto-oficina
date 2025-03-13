
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid, 
  FormControl, 
  InputLabel,
  MenuItem,
  Select,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
} from '@mui/material';
import { useNavigate, useLocation } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Quote, QuoteItem } from '../../models/types';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';

const CreateQuote = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { customers, services, addQuote } = useData();
  
  // Get customerId from URL if present
  const queryParams = new URLSearchParams(location.search);
  const customerIdFromUrl = queryParams.get('customerId');
  
  const [customerId, setCustomerId] = useState(customerIdFromUrl || '');
  const [items, setItems] = useState<QuoteItem[]>([]);
  const [notes, setNotes] = useState('');
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Get today's date in YYYY-MM-DD format
  const today = new Date().toISOString().split('T')[0];
  const [date, setDate] = useState(today);

  // Calculate the total
  const calculateTotal = () => {
    return items.reduce((total, item) => {
      const service = services.find(s => s.id === item.serviceId);
      return total + (service ? service.price * item.quantity : 0);
    }, 0);
  };

  // Add a new item to the quote
  const addItem = () => {
    if (services.length > 0) {
      setItems([...items, { serviceId: services[0].id, quantity: 1 }]);
    }
  };

  // Handle item change
  const handleItemChange = (index: number, field: 'serviceId' | 'quantity', value: string | number) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], [field]: value };
    setItems(newItems);
  };

  // Remove an item
  const removeItem = (index: number) => {
    const newItems = [...items];
    newItems.splice(index, 1);
    setItems(newItems);
  };

  // Validate the form
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!customerId) newErrors.customerId = 'O campo cliente é obrigatório';
    if (items.length === 0) newErrors.items = 'Informe pelo menos um serviço';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    const newQuote: Omit<Quote, 'id'> = {
      customerId,
      date,
      items,
      notes,
      status: 'rascunho',
      total: calculateTotal(),
    };
    
    addQuote(newQuote);
    navigate('/quotes');
  };

  // Add an initial item if there are none
  useEffect(() => {
    if (items.length === 0 && services.length > 0) {
      addItem();
    }
  }, [services, items.length, addItem]);

  // Format currency
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        Criar Novo Orçamento
      </Typography>
      
      <Paper className="form-paper">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <FormControl fullWidth error={!!errors.customerId}>
                <InputLabel id="customer-select-label">Cliente</InputLabel>
                <Select
                  labelId="customer-select-label"
                  
                  value={customerId}
                  label="Cliente"
                  onChange={(e) => setCustomerId(e.target.value as string)}
                >
                  {customers.map((customer) => (
                    <MenuItem key={customer.id} value={customer.id}>
                      {customer.name} - {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                    </MenuItem>
                  ))}
                </Select>
                {errors.customerId && (
                  <Typography color="error" variant="caption">
                    {errors.customerId}
                  </Typography>
                )}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Data"
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
                <Typography variant="h6">Serviços</Typography>
                <Button 
                  startIcon={<AddIcon />} 
                  onClick={addItem}
                  variant="outlined"
                  size="small"
                >
                  Adicionar Serviço
                </Button>
              </Box>
              
              {errors.items && (
                <Typography color="error" variant="caption" sx={{ display: 'block', mb: 2 }}>
                  {errors.items}
                </Typography>
              )}
              
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
                    {items.map((item, index) => {
                      const service = services.find(s => s.id === item.serviceId);
                      const price = service?.price || 0;
                      const subtotal = price * item.quantity;
                      
                      return (
                        <TableRow key={index}>
                          <TableCell>
                            <FormControl fullWidth size="small">
                              <Select
                                value={item.serviceId}
                                onChange={(e) => handleItemChange(index, 'serviceId', e.target.value)}
                              >
                                {services.map((service) => (
                                  <MenuItem key={service.id} value={service.id}>
                                    {service.name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                          </TableCell>
                          <TableCell>{formatCurrency(price)}</TableCell>
                          <TableCell>
                            <TextField
                              type="number"
                              InputProps={{ inputProps: { min: 1 } }}
                              value={item.quantity}
                              onChange={(e) => handleItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                              size="small"
                              sx={{ width: '80px' }}
                            />
                          </TableCell>
                          <TableCell>{formatCurrency(subtotal)}</TableCell>
                          <TableCell>
                            <IconButton 
                              color="error" 
                              onClick={() => removeItem(index)}
                              disabled={items.length === 1}
                            >
                              <DeleteIcon />
                            </IconButton>
                          </TableCell>
                        </TableRow>
                      );
                    })}
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
          
          <Box className="action-buttons">
            <Button 
              variant="outlined" 
              onClick={() => navigate('/quotes')}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              Criar Orçamento
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CreateQuote;
