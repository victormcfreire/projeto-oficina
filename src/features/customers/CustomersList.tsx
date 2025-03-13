
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
  TableRow 
} from '@mui/material';
import { Link } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import AddIcon from '@mui/icons-material/Add';

const CustomersList = () => {
  const { customers } = useData();

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
        <Typography variant="h4" component="h1" className="page-title">
          Customers
        </Typography>
        <Button 
          variant="contained" 
          component={Link} 
          to="/customers/new"
          startIcon={<AddIcon />}
        >
          Adicionar Cliente
        </Button>
      </Box>

      <TableContainer component={Paper}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Nome</TableCell>
              <TableCell>Email</TableCell>
              <TableCell>Telefone</TableCell>
              <TableCell>Veículo</TableCell>
              <TableCell>Ações</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {customers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} align="center">Nenhum cliente encontrado</TableCell>
              </TableRow>
            ) : (
              customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>{customer.name}</TableCell>
                  <TableCell>{customer.email}</TableCell>
                  <TableCell>{customer.phone}</TableCell>
                  <TableCell>
                    {customer.vehicle.year} {customer.vehicle.make} {customer.vehicle.model}
                  </TableCell>
                  <TableCell>
                    <Button 
                      component={Link} 
                      to={`/customers/${customer.id}`}
                      size="small"
                    >
                      Editar
                    </Button>
                    <Button 
                      component={Link} 
                      to={`/quotes/new?customerId=${customer.id}`}
                      size="small"
                      color="primary"
                    >
                      Criar Orçamento
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
};

export default CustomersList;
