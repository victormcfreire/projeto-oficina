
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
  TableRow 
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AddIcon from '@mui/icons-material/Add';
import { listCustomers } from '../../services/clienteService';
import Navigation from '../../components/Navigation';

const CustomersList = () => {
  const [ customers, setCustomers ] = useState<any[]>([]);
  const [ refresh, setRefresh ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.refresh) {
      setRefresh((prev) => !prev);
      loadCustomers();
      navigate(location.pathname, { replace: true, state: {} }); // Reseta o estado para evitar loops
    } else {
      loadCustomers();
    }

  }, [refresh]);

  const loadCustomers = async () => {
    const lista = await listCustomers();
    setCustomers(lista || []);
  };

  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1" className="page-title">
            Clientes
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/customers/add"
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
                        to={`/customers/edit/${customer.id}`}
                        size="small"
                      >
                        Editar
                      </Button>
                      <Button 
                        component={Link} 
                        to={`/quotes/create?customerId=${customer.id}`}
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
    </>
  );
};

export default CustomersList;
