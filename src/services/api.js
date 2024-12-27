import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour logger les requêtes
api.interceptors.request.use(
  (config) => {
    console.log('API Request:', {
      method: config.method.toUpperCase(),
      url: config.url,
      data: config.data,
    });
    return config;
  },
  (error) => {
    console.error('Request Error:', error);
    return Promise.reject(error);
  }
);

// Intercepteur pour logger les réponses
api.interceptors.response.use(
  (response) => {
    console.log('API Response:', {
      status: response.status,
      data: response.data,
    });
    return response;
  },
  (error) => {
    console.error('Response Error:', {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    return Promise.reject(error);
  }
);

export const simulationService = {
  createSimulation: async (simulationData) => {
    try {
      const response = await api.post('/simulations', simulationData);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la création de la simulation'
      );
    }
  },
  getSimulation: async (id) => {
    try {
      const response = await api.get(`/simulations/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération de la simulation'
      );
    }
  },
};

export const subscriptionService = {
  createSubscription: async (subscriptionData) => {
    try {
      console.log('Données de souscription envoyées:', subscriptionData);
      const response = await api.post('/subscriptions', subscriptionData);
      console.log('Réponse de souscription reçue:', response.data);
      return response.data;
    } catch (error) {
      console.error('Erreur détaillée:', {
        message: error.message,
        response: error.response?.data,
        status: error.response?.status,
        data: error.response?.data?.details || error.response?.data?.message
      });
      
      let errorMessage = 'Une erreur est survenue lors de la souscription.';
      
      if (error.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error.response?.status === 400) {
        errorMessage = 'Les données fournies sont invalides. Veuillez vérifier vos informations.';
      } else if (error.response?.status === 401) {
        errorMessage = 'Vous n\'êtes pas autorisé à effectuer cette action.';
      } else if (error.response?.status === 404) {
        errorMessage = 'Le service de souscription n\'est pas disponible.';
      } else if (error.response?.status === 500) {
        errorMessage = 'Une erreur serveur est survenue. Veuillez réessayer plus tard.';
      }

      throw new Error(errorMessage);
    }
  },
  getSubscription: async (id) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération de la souscription'
      );
    }
  },
  getSubscriptionStatus: async (id) => {
    try {
      const response = await api.get(`/subscriptions/status/${id}`);
      return response.data;
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération du statut'
      );
    }
  },
  getAttestation: async (id) => {
    try {
      const response = await api.get(`/subscriptions/${id}/attestation`, {
        responseType: 'blob'
      });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      return { url };
    } catch (error) {
      throw new Error(
        error.response?.data?.message || 
        'Erreur lors de la récupération de l\'attestation'
      );
    }
  },
}; 