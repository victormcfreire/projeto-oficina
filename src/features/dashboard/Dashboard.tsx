import React, { useEffect, useState } from "react";
import {
  Box,
  Typography,
  Grid,
  Paper,
  Button,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { listCustomers } from "../../services/clienteService";
import { listQuotes } from "../../services/orcamentoService";
import { useAuth } from "../../context/AuthContext";
import Navigation from "../../components/Navigation";

const Dashboard: React.FC = () => {
  const [ quotes, setQuotes ] = useState<any[]>([]);
  const [ customers, setCustomers ] = useState<any[]>([]);
  const { user } = useAuth();
  const [ refresh, setRefresh ] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const pendingQuotes = quotes.filter((quote) => quote.status === "pendente");
  const approvedQuotes = quotes.filter((quote) => quote.status === "aprovado");

  const totalRevenue = approvedQuotes.reduce((sum, quote) => {
    return sum + quote.total;
  }, 0);

  useEffect(() => {
    if (location.state?.refresh) {
      loadCustomers();
      loadQuotes();
      navigate(location.pathname, { replace: true, state: {} }); // Reseta o estado para evitar loops
    } else {
      loadCustomers();
      loadQuotes();
    }

  }, [refresh]);

  const loadCustomers = async () => {
    const lista = await listCustomers();
    setCustomers(lista || []);
  };

  const loadQuotes = async () => {
    const lista = await listQuotes();
    setQuotes(lista || []);
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" gutterBottom>
          Dashboard
        </Typography>

        <Typography variant="h6" sx={{ mb: 2 }}>
          Bem-vindo(a) de volta, {user?.username}!
        </Typography>

        <Grid container spacing={3}>
          {/* Summary Cards */}
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Clientes
              </Typography>
              <Typography variant="h3">{customers.length}</Typography>
              <Button
                component={Link}
                to="/customers"
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Ver Todos
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Orçamentos Pendentes
              </Typography>
              <Typography variant="h3">{pendingQuotes.length}</Typography>
              <Button
                component={Link}
                to="/quotes"
                variant="outlined"
                sx={{ mt: 2 }}
              >
                Ver Todos
              </Button>
            </Paper>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Receita Total
              </Typography>
              <Typography variant="h3">{formatCurrency(totalRevenue)}</Typography>
            </Paper>
          </Grid>

          {/* Recent Quotes */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Orçamentos Recentes
              </Typography>
              <List>
                {quotes.slice(0, 5).map((quote) => (
                  <React.Fragment key={quote.id}>
                    <ListItem>
                      <ListItemText
                        primary={`Quote #${quote.id}`}
                        secondary={`Customer: ${
                          customers.find((c) => c.id === quote.customerId)
                            ?.name || "Unknown"
                        } - $${quote.total.toFixed(2)} - ${quote.status}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {quotes.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Sem orçamentos disponíveis" />
                  </ListItem>
                )}
              </List>
              <Button
                component={Link}
                to="/quotes/create"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Criar Novo Orçamento
              </Button>
            </Paper>
          </Grid>

          {/* Recent Customers */}
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 2, height: "100%" }}>
              <Typography variant="h6" gutterBottom>
                Clientes Recentes
              </Typography>
              <List>
                {customers.slice(0, 5).map((customer) => (
                  <React.Fragment key={customer.id}>
                    <ListItem>
                      <ListItemText
                        primary={customer.name}
                        secondary={`${customer.phone} - ${customer.email}`}
                      />
                    </ListItem>
                    <Divider />
                  </React.Fragment>
                ))}
                {customers.length === 0 && (
                  <ListItem>
                    <ListItemText primary="Sem clientes disponíveis" />
                  </ListItem>
                )}
              </List>
              <Button
                component={Link}
                to="/customers/add"
                variant="contained"
                sx={{ mt: 2 }}
              >
                Adicionar Novo Cliente
              </Button>
            </Paper>
          </Grid>
        </Grid>
      </Box>
    </>
  );
};

export default Dashboard;
