
import React, { useState, useEffect } from 'react';
import { 
  Box, 
  Typography, 
  TextField, 
  Button, 
  Paper, 
  Grid,
  InputAdornment
} from '@mui/material';
import { useNavigate, useParams } from 'react-router-dom';
import { useData } from '../../context/DataContext';
import { Service } from '../../models/types';
import Navigation from '../../components/Navigation';

const ServiceForm: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  const { addService, updateService, getServiceById } = useData();
  const isEditMode = !!id;
  
  const [formData, setFormData] = useState<Omit<Service, 'id'>>({
    name: '',
    description: '',
    price: 0,
    estimatedHours: 0
  });
  
  const [errors, setErrors] = useState<Record<string, string>>({});
  
  useEffect(() => {
    if (isEditMode && id) {
      const service = getServiceById(id);
      if (service) {
        setFormData({
          name: service.name,
          description: service.description,
          price: service.price,
          estimatedHours: service.estimatedHours
        });
      } else {
        navigate('/services');
      }
    }
  }, [id, isEditMode, getServiceById, navigate]);
  
  const validate = () => {
    const newErrors: Record<string, string> = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'O nome do sereviço é obrigatório.';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Informe uma descrição para o serviço.';
    }
    
    if (formData.price <= 0) {
      newErrors.price = 'O preço do serviço deve ser maior que zero.';
    }
    
    if (formData.estimatedHours <= 0) {
      newErrors.estimatedHours = 'As horas estimadas devem ser maior que zero.';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    
    setFormData(prev => ({
      ...prev,
      [name]: name === 'price' || name === 'estimatedHours' 
        ? parseFloat(value) || 0 
        : value
    }));
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validate()) return;
    
    if (isEditMode && id) {
      updateService({ id, ...formData });
    } else {
      addService(formData);
    }
    
    navigate('/services');
  };
  
  return (
    <>
      <Navigation />
      <Box sx={{ p: 3 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          {isEditMode ? 'Editar Serviço' : 'Adicionar Novo Serviço'}
        </Typography>
        
        <Paper sx={{ p: 3 }}>
          <Box component="form" onSubmit={handleSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Nome do Serviço"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  error={!!errors.name}
                  helperText={errors.name}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  fullWidth
                  label="Descrição"
                  name="description"
                  value={formData.description}
                  onChange={handleChange}
                  multiline
                  rows={3}
                  error={!!errors.description}
                  helperText={errors.description}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Preço"
                  name="price"
                  type="number"
                  value={formData.price}
                  onChange={handleChange}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">$</InputAdornment>,
                    inputProps: { min: 0, step: 0.01 }
                  }}
                  error={!!errors.price}
                  helperText={errors.price}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  fullWidth
                  label="Horas Estimadas"
                  name="estimatedHours"
                  type="number"
                  value={formData.estimatedHours}
                  onChange={handleChange}
                  InputProps={{
                    inputProps: { min: 0, step: 0.1 }
                  }}
                  error={!!errors.estimatedHours}
                  helperText={errors.estimatedHours}
                  required
                />
              </Grid>
            </Grid>
            
            <Box sx={{ mt: 3, display: 'flex', justifyContent: 'flex-end', gap: 2 }}>
              <Button 
                variant="outlined" 
                onClick={() => navigate('/services')}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                variant="contained"
              >
                {isEditMode ? 'Atualizar Serviço' : 'Adicionar Serviço'}
              </Button>
            </Box>
          </Box>
        </Paper>
      </Box>
    </>
  );
};

export default ServiceForm;
