import React from 'react';
import Grid2 from '@mui/material/Unstable_Grid2';
import { Container, Typography, Card, CardContent, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';

const products = [
  {
    name: 'Papillon',
    description: 'RC, DOMMAGE, VOL',
    categories: ['201'],
  },
  {
    name: 'Douby',
    description: 'RC, DOMMAGE, TIERCE COLLISION',
    categories: ['202'],
  },
  {
    name: 'Douyou',
    description: 'RC, DOMMAGE, COLLISION, INCENDIE',
    categories: ['201', '202'],
  },
  {
    name: 'Toutourisquou',
    description: 'Toutes garanties',
    categories: ['201'],
  },
];

const Home = () => {
  const navigate = useNavigate();

  return (
    <Container sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom align="center">
        Bienvenue chez NSIAGO'ASSUR
      </Typography>
      <Typography variant="h6" gutterBottom align="center" color="text.secondary" sx={{ mb: 4 }}>
        Découvrez nos produits d'assurance automobile
      </Typography>

      <Grid2 container spacing={3}>
        {products.map((product) => (
          <Grid2 item xs={12} sm={6} md={3} key={product.name}>
            <Card>
              <CardContent>
                <Typography variant="h6" gutterBottom>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" gutterBottom>
                  {product.description}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  Catégories: {product.categories.join(', ')}
                </Typography>
              </CardContent>
              <Button 
                fullWidth 
                onClick={() => navigate('/simulation')}
                sx={{ mt: 1 }}
              >
                Simuler
              </Button>
            </Card>
          </Grid2>
        ))}
      </Grid2>
    </Container>
  );
};

export default Home; 