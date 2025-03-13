import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Box, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { AuthProvider } from './context/AuthContext';
import { DataProvider } from './context/DataContext';
import PrivateRoute from './components/PrivateRoute';

// Auth
import Login from './features/auth/Login';
import Register from './features/auth/Register';

// Features
import Dashboard from './features/dashboard/Dashboard';
import CustomersList from './features/customers/CustomersList';
import CustomerForm from './features/customers/CustomerForm';
import QuotesList from './features/quotes/QuotesList';
import CreateQuote from './features/quotes/CreateQuote';

// Placeholder components for services
import ServicesList from './features/services/ServicesList'; // Placeholder
import ServiceForm from './features/services/ServiceForm';     // Placeholder

// Styles
import './App.css';

const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <DataProvider>
          <Router>
            <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
              <Routes>
                {/* Public Routes */}
                <Route path="/login" element={<Login />} />
                <Route path="/register" element={<Register />} />

                {/* Protected Routes */}
                <Route element={<PrivateRoute />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/customers" element={<CustomersList />} />
                  <Route path="/customers/add" element={<CustomerForm />} />
                  <Route path="/customers/edit/:id" element={<CustomerForm />} />
                  <Route path="/quotes" element={<QuotesList />} />
                  <Route path="/quotes/create" element={<CreateQuote />} />
                  <Route path="/services" element={<ServicesList />} />
                  <Route path="/services/new" element={<ServiceForm />} />
                  <Route path="/services/edit/:id" element={<ServiceForm />} />
                </Route>

                {/* Redirects */}
                <Route path="/" element={<Navigate to="/dashboard" replace />} />
                <Route path="*" element={<Navigate to="/login" />} />
              </Routes>
            </Box>
          </Router>
        </DataProvider>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;