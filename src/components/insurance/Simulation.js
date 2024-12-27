import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  MenuItem,
  Button,
  Box,
} from '@mui/material';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const vehicleCategories = [
  { code: '201', label: 'Promenade et Affaire' },
  { code: '202', label: 'Véhicules Motorisés à 2 ou 3 roues' },
  { code: '203', label: 'Transport public de voyage' },
  { code: '204', label: 'Véhicule de transport avec taximètres' },
];

const products = [
  { name: 'Papillon', categories: ['201'] },
  { name: 'Douby', categories: ['202'] },
  { name: 'Douyou', categories: ['201', '202'] },
  { name: 'Toutourisquou', categories: ['201'] },
];

const fiscalPowerRanges = [
  { value: '2', label: '2 CV', price: 37601 },
  { value: '3-6', label: '3 à 6 CV', price: 45181 },
  { value: '7-10', label: '7 à 10 CV', price: 51078 },
  { value: '11-14', label: '11 à 14 CV', price: 65677 },
  { value: '15-23', label: '15 à 23 CV', price: 86456 },
  { value: '24+', label: '24 CV et plus', price: 104143 },
];

const Simulation = () => {
  const [simulationResult, setSimulationResult] = useState(null);

  const formik = useFormik({
    initialValues: {
      category: '',
      product: '',
      fiscalPower: '',
      vehicleValue: '',
      vehicleAge: '',
    },
    validationSchema: Yup.object({
      category: Yup.string().required('La catégorie est requise'),
      product: Yup.string().required('Le produit est requis'),
      fiscalPower: Yup.string().required('La puissance fiscale est requise'),
      vehicleValue: Yup.number()
        .required('La valeur du véhicule est requise')
        .positive('La valeur doit être positive'),
      vehicleAge: Yup.number()
        .required("L'âge du véhicule est requis")
        .min(0, "L'âge ne peut pas être négatif")
        .max(20, "L'âge ne peut pas dépasser 20 ans"),
    }),
    onSubmit: (values) => {
      // Calcul de la prime de base (RC)
      const basePremium = fiscalPowerRanges.find(
        (range) => range.value === values.fiscalPower
      ).price;

      // Calcul des primes additionnelles selon le produit
      let additionalPremiums = 0;
      const vehicleValue = parseFloat(values.vehicleValue);

      if (values.product === 'Papillon') {
        additionalPremiums += vehicleValue * 0.026; // DOMMAGE
        additionalPremiums += vehicleValue * 0.0014; // VOL
      } else if (values.product === 'Douby') {
        additionalPremiums += vehicleValue * 0.026; // DOMMAGE
        additionalPremiums += vehicleValue * 0.0165; // TIERCE COLLISION
      }

      const totalPremium = basePremium + additionalPremiums;

      setSimulationResult({
        quoteReference: `QT${Math.random().toString(36).substr(2, 12).toUpperCase()}`,
        endDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        price: Math.round(totalPremium),
      });
    },
  });

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Simulation d'assurance
        </Typography>

        <form onSubmit={formik.handleSubmit}>
          <Grid2 container spacing={3}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="category"
                label="Catégorie du véhicule"
                value={formik.values.category}
                onChange={formik.handleChange}
                error={formik.touched.category && Boolean(formik.errors.category)}
                helperText={formik.touched.category && formik.errors.category}
              >
                {vehicleCategories.map((category) => (
                  <MenuItem key={category.code} value={category.code}>
                    {category.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="product"
                label="Produit d'assurance"
                value={formik.values.product}
                onChange={formik.handleChange}
                error={formik.touched.product && Boolean(formik.errors.product)}
                helperText={formik.touched.product && formik.errors.product}
              >
                {products
                  .filter((product) =>
                    product.categories.includes(formik.values.category)
                  )
                  .map((product) => (
                    <MenuItem key={product.name} value={product.name}>
                      {product.name}
                    </MenuItem>
                  ))}
              </TextField>
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="fiscalPower"
                label="Puissance fiscale"
                value={formik.values.fiscalPower}
                onChange={formik.handleChange}
                error={formik.touched.fiscalPower && Boolean(formik.errors.fiscalPower)}
                helperText={formik.touched.fiscalPower && formik.errors.fiscalPower}
              >
                {fiscalPowerRanges.map((range) => (
                  <MenuItem key={range.value} value={range.value}>
                    {range.label}
                  </MenuItem>
                ))}
              </TextField>
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="vehicleValue"
                label="Valeur du véhicule (FCFA)"
                type="number"
                value={formik.values.vehicleValue}
                onChange={formik.handleChange}
                error={formik.touched.vehicleValue && Boolean(formik.errors.vehicleValue)}
                helperText={formik.touched.vehicleValue && formik.errors.vehicleValue}
              />
            </Grid2>

            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="vehicleAge"
                label="Âge du véhicule (années)"
                type="number"
                value={formik.values.vehicleAge}
                onChange={formik.handleChange}
                error={formik.touched.vehicleAge && Boolean(formik.errors.vehicleAge)}
                helperText={formik.touched.vehicleAge && formik.errors.vehicleAge}
              />
            </Grid2>

            <Grid2 item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                fullWidth
              >
                Calculer la prime
              </Button>
            </Grid2>
          </Grid2>
        </form>

        {simulationResult && (
          <Box mt={4} p={2} bgcolor="background.paper" borderRadius={1}>
            <Typography variant="h6" gutterBottom>
              Résultat de la simulation
            </Typography>
            <Typography>
              Référence du devis: {simulationResult.quoteReference}
            </Typography>
            <Typography>
              Valide jusqu'au: {simulationResult.endDate}
            </Typography>
            <Typography>
              Prime totale: {simulationResult.price.toLocaleString()} FCFA
            </Typography>
          </Box>
        )}
      </Paper>
    </Container>
  );
};

export default Simulation; 