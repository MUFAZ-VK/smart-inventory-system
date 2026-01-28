import axios from 'axios';

// API Base Configuration
const API_BASE_URL = import.meta.env.PROD ? '/api' : 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const csrftoken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];

    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      const path = window.location.pathname;
      const isAuthPage = ['/login', '/signup', '/forgot-password', '/reset'].some(p => path.startsWith(p));

      if (!isAuthPage) {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// --- PRODUCT OPERATIONS ---

export const fetchProducts = async () => {
  try {
    const response = await api.get('/products/');
    return response.data;
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

export const addProduct = async (productData) => {
  try {
    const response = await api.post('/add-product/', productData);
    return response.data;
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}/update/`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// --- BRANCH OPERATIONS ---

export const fetchBranches = async () => {
  try {
    const response = await api.get('/branches/');
    return response.data;
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

export const addBranch = async (branchData) => {
  try {
    const response = await api.post('/add-branch/', branchData);
    return response.data;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

export const getBranch = async (branchId) => {
  try {
    const response = await api.get(`/branches/${branchId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

export const updateBranch = async (branchId, branchData) => {
  try {
    const response = await api.put(`/branches/${branchId}/update/`, branchData);
    return response.data;
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

export const deleteBranch = async (branchId) => {
  try {
    const response = await api.delete(`/branches/${branchId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};

// --- STOCK & SALES OPERATIONS ---

export const fetchStock = async () => {
  try {
    const response = await api.get('/stock/');
    return response.data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

export const addStock = async (stockData) => {
  try {
    const response = await api.post('/add-stock/', stockData);
    return response.data;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

export const getStock = async (stockId) => {
  try {
    const response = await api.get(`/stock/${stockId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

export const updateStock = async (stockId, stockData) => {
  try {
    const response = await api.put(`/stock/${stockId}/update/`, stockData);
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

export const deleteStock = async (stockId) => {
  try {
    const response = await api.delete(`/stock/${stockId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

export const fetchSales = async () => {
  try {
    const response = await api.get('/sales/');
    return response.data;
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

export const recordSale = async (saleData) => {
  try {
    const response = await api.post('/add-sale/', saleData);
    return response.data;
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
};

export const deleteSale = async (saleId) => {
  try {
    const response = await api.delete(`/sales/${saleId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// --- AUTHENTICATION ---

export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/login/', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

export const logoutUser = async () => {
  try {
    const response = await api.post('/logout/');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth/');
    return response.data;
  } catch (error) {
    console.error('Error checking auth:', error);
    throw error;
  }
};

export const signupUser = async (userData) => {
  try {
    const response = await api.post('/accounts/signup/', userData);
    return response.data;
  } catch (error) {
    console.error('Error signing up:', error);
    throw error;
  }
};

export const requestPasswordReset = async (email) => {
  try {
    const response = await api.post('/accounts/password-reset/', { email });
    return response.data;
  } catch (error) {
    console.error('Error requesting password reset:', error);
    throw error;
  }
};

export const confirmPasswordReset = async (data) => {
  try {
    const response = await api.post('/accounts/password-reset-confirm/', data);
    return response.data;
  } catch (error) {
    console.error('Error confirming password reset:', error);
    throw error;
  }
};

