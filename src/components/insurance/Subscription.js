import React, { useState } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  Box,
  Alert,
  MenuItem,
  CircularProgress,
} from '@mui/material';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { subscriptionService } from '../../services/api';
import Grid2 from '@mui/material/Unstable_Grid2';
import { useNavigate } from 'react-router-dom';

const steps = ['Informations véhicule', 'Informations assuré', 'Récapitulatif'];

const vehicleCategories = [
  { code: '201', label: 'Promenade et Affaire' },
  { code: '202', label: 'Véhicules Motorisés à 2 ou 3 roues' },
  { code: '203', label: 'Transport public de voyage' },
  { code: '204', label: 'Véhicule de transport avec taximètres' },
];

const vehicleValidationSchema = Yup.object({
  firstRegistrationDate: Yup.date()
    .required('La date est requise')
    .max(new Date(), 'La date ne peut pas être dans le futur')
    .min(new Date(1900, 0, 1), 'Date invalide'),
  registrationNumber: Yup.string()
    .required("Le numéro d'immatriculation est requis")
    .matches(/^[A-Z0-9]{1,10}$/, "Format d'immatriculation invalide"),
  color: Yup.string()
    .required('La couleur est requise')
    .min(3, 'La couleur doit contenir au moins 3 caractères'),
  seats: Yup.number()
    .required('Le nombre de sièges est requis')
    .min(1, 'Minimum 1 siège')
    .max(50, 'Maximum 50 sièges')
    .integer('Le nombre de sièges doit être un nombre entier'),
  doors: Yup.number()
    .required('Le nombre de portes est requis')
    .min(1, 'Minimum 1 porte')
    .max(6, 'Maximum 6 portes')
    .integer('Le nombre de portes doit être un nombre entier'),
  category: Yup.string()
    .required('La catégorie est requise')
    .oneOf(vehicleCategories.map(cat => cat.code), 'Catégorie invalide'),
});

const insureeValidationSchema = Yup.object({
  address: Yup.string()
    .required("L'adresse est requise")
    .min(5, "L'adresse doit contenir au moins 5 caractères"),
  phone: Yup.string()
    .required('Le téléphone est requis')
    .matches(/^[0-9+]{8,15}$/, 'Numéro de téléphone invalide'),
  firstName: Yup.string()
    .required('Le prénom est requis')
    .min(2, 'Le prénom doit contenir au moins 2 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le prénom contient des caractères invalides'),
  lastName: Yup.string()
    .required('Le nom est requis')
    .min(2, 'Le nom doit contenir au moins 2 caractères')
    .matches(/^[a-zA-ZÀ-ÿ\s'-]+$/, 'Le nom contient des caractères invalides'),
  idNumber: Yup.string()
    .required("Le numéro de carte d'identité est requis")
    .min(5, "Le numéro d'identité doit contenir au moins 5 caractères"),
  city: Yup.string()
    .required('La ville est requise')
    .min(2, 'La ville doit contenir au moins 2 caractères'),
});

const Subscription = () => {
  const [activeStep, setActiveStep] = useState(0);
  const [subscriptionResult, setSubscriptionResult] = useState(null);
  const [error, setError] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();

  const formik = useFormik({
    initialValues: {
      firstRegistrationDate: '',
      registrationNumber: '',
      color: '',
      seats: '',
      doors: '',
      category: '',
      address: '',
      phone: '',
      firstName: '',
      lastName: '',
      idNumber: '',
      city: '',
    },
    validationSchema: activeStep === 0 ? vehicleValidationSchema : insureeValidationSchema,
    onSubmit: async (values) => {
      if (activeStep === steps.length - 1) {
        setIsSubmitting(true);
        setError(null);
        try {
          // Validation finale de toutes les données
          await vehicleValidationSchema.validate({
            firstRegistrationDate: values.firstRegistrationDate,
            registrationNumber: values.registrationNumber,
            color: values.color,
            seats: values.seats,
            doors: values.doors,
            category: values.category,
          });
          
          await insureeValidationSchema.validate({
            address: values.address,
            phone: values.phone,
            firstName: values.firstName,
            lastName: values.lastName,
            idNumber: values.idNumber,
            city: values.city,
          });

          const result = await subscriptionService.createSubscription({
            vehicle: {
              firstRegistrationDate: values.firstRegistrationDate,
              registrationNumber: values.registrationNumber.toUpperCase(),
              color: values.color,
              seats: parseInt(values.seats),
              doors: parseInt(values.doors),
              category: values.category
            },
            insuree: {
              firstName: values.firstName,
              lastName: values.lastName,
              address: values.address,
              phone: values.phone,
              idNumber: values.idNumber,
              city: values.city
            }
          });

          setSubscriptionResult(result);
          
          if (result.id) {
            try {
              const attestation = await subscriptionService.getAttestation(result.id);
              if (attestation && attestation.url) {
                window.open(attestation.url, '_blank');
              }
            } catch (attestationError) {
              console.error('Erreur lors de la récupération de l\'attestation:', attestationError);
              setError('La souscription a réussi mais l\'attestation n\'a pas pu être générée. Veuillez réessayer de la télécharger.');
            }
          }
        } catch (error) {
          console.error('Erreur lors de la souscription:', error);
          setError(error.message || 'Une erreur est survenue lors de la souscription. Veuillez réessayer.');
        } finally {
          setIsSubmitting(false);
        }
      } else {
        handleNext();
      }
    },
  });

  const handleNext = () => {
    const schema = activeStep === 0 ? vehicleValidationSchema : insureeValidationSchema;
    const currentValues = activeStep === 0 ? {
      firstRegistrationDate: formik.values.firstRegistrationDate,
      registrationNumber: formik.values.registrationNumber,
      color: formik.values.color,
      seats: formik.values.seats,
      doors: formik.values.doors,
      category: formik.values.category,
    } : {
      address: formik.values.address,
      phone: formik.values.phone,
      firstName: formik.values.firstName,
      lastName: formik.values.lastName,
      idNumber: formik.values.idNumber,
      city: formik.values.city,
    };

    try {
      schema.validateSync(currentValues, { abortEarly: false });
      setActiveStep((prevStep) => prevStep + 1);
      setError(null);
    } catch (err) {
      setError('Veuillez corriger les erreurs avant de continuer.');
      formik.validateForm();
    }
  };

  const handleBack = () => {
    setActiveStep((prevStep) => prevStep - 1);
    setError(null);
  };

  const renderStepContent = (step) => {
    switch (step) {
      case 0:
        return (
          <Grid2 container spacing={3}>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstRegistrationDate"
                label="Date de première mise en circulation"
                type="date"
                value={formik.values.firstRegistrationDate}
                onChange={formik.handleChange}
                error={formik.touched.firstRegistrationDate && Boolean(formik.errors.firstRegistrationDate)}
                helperText={formik.touched.firstRegistrationDate && formik.errors.firstRegistrationDate}
                InputLabelProps={{ shrink: true }}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="registrationNumber"
                label="Numéro d'immatriculation"
                value={formik.values.registrationNumber}
                onChange={formik.handleChange}
                error={formik.touched.registrationNumber && Boolean(formik.errors.registrationNumber)}
                helperText={formik.touched.registrationNumber && formik.errors.registrationNumber}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="color"
                label="Couleur"
                value={formik.values.color}
                onChange={formik.handleChange}
                error={formik.touched.color && Boolean(formik.errors.color)}
                helperText={formik.touched.color && formik.errors.color}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="seats"
                label="Nombre de sièges"
                type="number"
                value={formik.values.seats}
                onChange={formik.handleChange}
                error={formik.touched.seats && Boolean(formik.errors.seats)}
                helperText={formik.touched.seats && formik.errors.seats}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="doors"
                label="Nombre de portes"
                type="number"
                value={formik.values.doors}
                onChange={formik.handleChange}
                error={formik.touched.doors && Boolean(formik.errors.doors)}
                helperText={formik.touched.doors && formik.errors.doors}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                select
                name="category"
                label="Catégorie"
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
          </Grid2>
        );
      case 1:
        return (
          <Grid2 container spacing={3}>
            <Grid2 item xs={12}>
              <TextField
                fullWidth
                name="address"
                label="Adresse"
                value={formik.values.address}
                onChange={formik.handleChange}
                error={formik.touched.address && Boolean(formik.errors.address)}
                helperText={formik.touched.address && formik.errors.address}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="phone"
                label="Téléphone"
                value={formik.values.phone}
                onChange={formik.handleChange}
                error={formik.touched.phone && Boolean(formik.errors.phone)}
                helperText={formik.touched.phone && formik.errors.phone}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="firstName"
                label="Prénom"
                value={formik.values.firstName}
                onChange={formik.handleChange}
                error={formik.touched.firstName && Boolean(formik.errors.firstName)}
                helperText={formik.touched.firstName && formik.errors.firstName}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="lastName"
                label="Nom"
                value={formik.values.lastName}
                onChange={formik.handleChange}
                error={formik.touched.lastName && Boolean(formik.errors.lastName)}
                helperText={formik.touched.lastName && formik.errors.lastName}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="idNumber"
                label="Numéro de carte d'identité"
                value={formik.values.idNumber}
                onChange={formik.handleChange}
                error={formik.touched.idNumber && Boolean(formik.errors.idNumber)}
                helperText={formik.touched.idNumber && formik.errors.idNumber}
              />
            </Grid2>
            <Grid2 item xs={12} sm={6}>
              <TextField
                fullWidth
                name="city"
                label="Ville"
                value={formik.values.city}
                onChange={formik.handleChange}
                error={formik.touched.city && Boolean(formik.errors.city)}
                helperText={formik.touched.city && formik.errors.city}
              />
            </Grid2>
          </Grid2>
        );
      case 2:
        return (
          <Box>
            <Typography variant="h6" gutterBottom>
              Récapitulatif du véhicule
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 item xs={6}>
                <Typography>Immatriculation: {formik.values.registrationNumber}</Typography>
                <Typography>Couleur: {formik.values.color}</Typography>
                <Typography>Nombre de sièges: {formik.values.seats}</Typography>
              </Grid2>
              <Grid2 item xs={6}>
                <Typography>Nombre de portes: {formik.values.doors}</Typography>
                <Typography>Catégorie: {formik.values.category}</Typography>
              </Grid2>
            </Grid2>

            <Typography variant="h6" gutterBottom sx={{ mt: 3 }}>
              Informations personnelles
            </Typography>
            <Grid2 container spacing={2}>
              <Grid2 item xs={6}>
                <Typography>Nom: {formik.values.lastName}</Typography>
                <Typography>Prénom: {formik.values.firstName}</Typography>
                <Typography>Téléphone: {formik.values.phone}</Typography>
              </Grid2>
              <Grid2 item xs={6}>
                <Typography>Adresse: {formik.values.address}</Typography>
                <Typography>Ville: {formik.values.city}</Typography>
                <Typography>N° Carte d'identité: {formik.values.idNumber}</Typography>
              </Grid2>
            </Grid2>
          </Box>
        );
      default:
        return null;
    }
  };

  if (subscriptionResult) {
    return (
      <Container maxWidth="md" sx={{ py: 4 }}>
        <Paper elevation={3} sx={{ p: 3 }}>
          <Typography variant="h5" gutterBottom color="primary">
            Souscription réussie !
          </Typography>
          <Typography gutterBottom>
            Numéro de souscription: {subscriptionResult.id}
          </Typography>
          <Typography gutterBottom>
            Votre attestation d'assurance a été générée. Si elle ne s'est pas ouverte automatiquement, 
            vous pouvez la télécharger en cliquant sur le bouton ci-dessous.
          </Typography>
          {error && (
            <Alert severity="warning" sx={{ my: 2 }}>
              {error}
            </Alert>
          )}
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => subscriptionService.getAttestation(subscriptionResult.id)}
            >
              Télécharger l'attestation
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/')}
            >
              Retour à l'accueil
            </Button>
          </Box>
        </Paper>
      </Container>
    );
  }

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 3 }}>
        <Typography variant="h5" gutterBottom>
          Souscription d'assurance
        </Typography>

        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            {error}
          </Alert>
        )}

        <Stepper activeStep={activeStep} sx={{ py: 4 }}>
          {steps.map((label) => (
            <Step key={label}>
              <StepLabel>{label}</StepLabel>
            </Step>
          ))}
        </Stepper>

        <form onSubmit={formik.handleSubmit}>
          {renderStepContent(activeStep)}

          <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 3 }}>
            {activeStep !== 0 && (
              <Button 
                onClick={handleBack} 
                sx={{ mr: 1 }}
                disabled={isSubmitting}
              >
                Pr��cédent
              </Button>
            )}
            <Button
              variant="contained"
              type="submit"
              disabled={isSubmitting}
              startIcon={isSubmitting ? <CircularProgress size={20} /> : null}
            >
              {activeStep === steps.length - 1 ? 'Souscrire' : 'Suivant'}
            </Button>
          </Box>
        </form>
      </Paper>
    </Container>
  );
};

export default Subscription; 