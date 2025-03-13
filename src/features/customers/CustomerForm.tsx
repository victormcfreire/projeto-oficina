import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  Grid,
  Divider,
} from "@mui/material";
import { useNavigate, useParams } from "react-router-dom";
import { useData } from "../../context/DataContext";
import { Customer, Vehicle } from "../../models/types";

const emptyCustomer: Omit<Customer, "id"> = {
  name: "",
  email: "",
  phone: "",
  address: "",
  vehicle: {
    make: "",
    model: "",
    year: "",
    vin: "",
    licensePlate: "",
  },
};

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addCustomer, updateCustomer, getCustomerById } = useData();

  const [formData, setFormData] = useState<Omit<Customer, "id"> | Customer>(
    emptyCustomer,
  );
  const [errors, setErrors] = useState<Record<string, string>>({});

  useEffect(() => {
    if (id) {
      const customer = getCustomerById(id);
      if (customer) {
        setFormData(customer);
      } else {
        navigate("/customers");
      }
    }
  }, [id, getCustomerById, navigate]);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;

    if (name.startsWith("vehicle.")) {
      const vehicleField = name.split(".")[1];
      setFormData({
        ...formData,
        vehicle: {
          ...formData.vehicle,
          [vehicleField]: value,
        },
      });
    } else {
      setFormData({
        ...formData,
        [name]: value,
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) newErrors.name = "O nome é obrigatório";
    if (!formData.email.trim()) newErrors.email = "O emai é obrigatório";
    if (!/^\S+@\S+\.\S+$/.test(formData.email))
      newErrors.email = "O email é inválido";
    if (!formData.phone.trim()) newErrors.phone = "O telefone é obrigatório";

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!validate()) return;

    if ("id" in formData) {
      updateCustomer(formData as Customer);
    } else {
      addCustomer(formData);
    }

    navigate("/customers");
  };

  return (
    <Box>
      <Typography variant="h4" component="h1" className="page-title">
        {id ? "Editar Cliente" : "Adicionar Cliente"}
      </Typography>

      <Paper className="form-paper">
        <form onSubmit={handleSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <Typography variant="h6">Informações do Cliente</Typography>
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Nome"
                name="name"
                value={formData.name}
                onChange={handleChange}
                error={!!errors.name}
                helperText={errors.name}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleChange}
                error={!!errors.email}
                helperText={errors.email}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Telefone"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                error={!!errors.phone}
                helperText={errors.phone}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                fullWidth
                label="Endereço"
                name="address"
                value={formData.address}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12}>
              <Divider sx={{ my: 2 }} />
              <Typography variant="h6">Informações do Veículo</Typography>
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Marca"
                name="vehicle.make"
                value={formData.vehicle.make}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Modelo"
                name="vehicle.model"
                value={formData.vehicle.model}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={4}>
              <TextField
                fullWidth
                label="Ano de Fabricação"
                name="vehicle.year"
                value={formData.vehicle.year}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Número de Chassi"
                name="vehicle.vin"
                value={formData.vehicle.vin}
                onChange={handleChange}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                fullWidth
                label="Placa do Veículo"
                name="vehicle.licensePlate"
                value={formData.vehicle.licensePlate}
                onChange={handleChange}
              />
            </Grid>
          </Grid>

          <Box className="action-buttons">
            <Button
              variant="outlined"
              onClick={() => navigate("/customers")}
              sx={{ mr: 1 }}
            >
              Cancelar
            </Button>
            <Button type="submit" variant="contained">
              {id ? "Atualizar Cliente" : "Adicionar Cliente"}
            </Button>
          </Box>
        </form>
      </Paper>
    </Box>
  );
};

export default CustomerForm;
