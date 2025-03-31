
import React, { useEffect, useState } from 'react';
import { 
  Box, 
  Typography, 
  Paper, 
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  IconButton,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle
} from '@mui/material';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Navigation from '../../components/Navigation';
import { listServices, deleteService } from "./../../services/servicoService";

const ServicesList: React.FC = () => {
  const [ services, setServicos] = useState<any[]>([]);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [serviceToDelete, setServiceToDelete] = useState<string | null>(null);
  const [ refresh, setRefresh ] = useState(false);
    const location = useLocation();
    const navigate = useNavigate();

  useEffect(() => {
    if (location.state?.refresh) {
      setRefresh((prev) => !prev);
      loadServices();
      navigate(location.pathname, { replace: true, state: {} });
    } else {
      loadServices();
    }
  }, [refresh]);

  const handleDeleteClick = (id: string) => {
    setServiceToDelete(id);
    setDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    if (serviceToDelete) {
      deleteSelectedService(serviceToDelete);
      setDeleteDialogOpen(false);
      setServiceToDelete(null);
    }
  };

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(amount);
  };

  const loadServices = async () => {
    const lista = await listServices();
    setServicos(lista || []);
  };

  const deleteSelectedService = async (serviceId: string) => {
    await deleteService(serviceId);
    loadServices();
  };

  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
          <Typography variant="h4" component="h1">
            Serviços
          </Typography>
          <Button 
            variant="contained" 
            component={Link} 
            to="/services/new"
          >
            Adicionar Novo Serviço
          </Button>
        </Box>

        <Paper>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Nome</TableCell>
                  <TableCell>Descrição</TableCell>
                  <TableCell>Preço</TableCell>
                  <TableCell>Horas Estimadas</TableCell>
                  <TableCell>Ações</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {services.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} align="center">
                      Sem serviços disponíveis. Crie seu primeiro serviço!
                    </TableCell>
                  </TableRow>
                ) : (
                  services.map((service) => (
                    <TableRow key={service.id}>
                      <TableCell>{service.name}</TableCell>
                      <TableCell>{service.description}</TableCell>
                      <TableCell>{formatCurrency(service.price)}</TableCell>
                      <TableCell>{service.estimatedHours}</TableCell>
                      <TableCell>
                        <IconButton 
                          component={Link} 
                          to={`/services/edit/${service.id}`}
                          color="primary"
                        >
                          <EditIcon />
                        </IconButton>
                        <IconButton 
                          color="error"
                          onClick={() => handleDeleteClick(service.id)}
                        >
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </Paper>

        {/* Delete Confirmation Dialog */}
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

export default ServicesList;
