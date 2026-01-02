import axios from 'axios';

// Base URL for the Django backend API
// Change this to match your Django server address
const API_BASE_URL = 'http://localhost:8000/api';

// Create an axios instance with default configuration
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Important: Send cookies/session with requests
});

// Add request interceptor to include CSRF token if available
api.interceptors.request.use(
  (config) => {
    // Get CSRF token from cookies if available
    const csrftoken = document.cookie
      .split('; ')
      .find(row => row.startsWith('csrftoken='))
      ?.split('=')[1];
    
    if (csrftoken) {
      config.headers['X-CSRFToken'] = csrftoken;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle authentication errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // If unauthorized, clear auth and redirect to login
    if (error.response?.status === 401) {
      // Only redirect if not already on login page
      if (window.location.pathname !== '/login') {
        localStorage.removeItem('isAuthenticated');
        localStorage.removeItem('user');
        window.location.href = '/login';
      }
    }
    return Promise.reject(error);
  }
);

// Function to fetch all products from the backend
export const fetchProducts = async () => {
  try {
    const response = await api.get('/products/');
    return response.data;  // Returns array of products
  } catch (error) {
    console.error('Error fetching products:', error);
    throw error;
  }
};

// Function to add a new product to the backend
// productData should be: { name: "Product Name", price: 99.99 }
export const addProduct = async (productData) => {
  try {
    const response = await api.post('/add-product/', productData);
    return response.data;  // Returns the created product
  } catch (error) {
    console.error('Error adding product:', error);
    throw error;
  }
};

// Function to record a sale in the backend
// saleData should be: { branch: 1, product: 2, quantity: 5 }
// Note: branch and product should be IDs (numbers)
export const recordSale = async (saleData) => {
  try {
    const response = await api.post('/add-sale/', saleData);
    return response.data;  // Returns the created sale record
  } catch (error) {
    console.error('Error recording sale:', error);
    throw error;
  }
};

// Function to fetch all stock information from the backend
export const fetchStock = async () => {
  try {
    const response = await api.get('/stock/');
    return response.data;  // Returns array of stock records
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

// Function to fetch all branches from the backend
export const fetchBranches = async () => {
  try {
    const response = await api.get('/branches/');
    return response.data;  // Returns array of branches
  } catch (error) {
    console.error('Error fetching branches:', error);
    throw error;
  }
};

// Function to fetch all sales from the backend
export const fetchSales = async () => {
  try {
    const response = await api.get('/sales/');
    return response.data;  // Returns array of sales records
  } catch (error) {
    console.error('Error fetching sales:', error);
    throw error;
  }
};

// ========== PRODUCT CRUD OPERATIONS ==========

// Function to get a single product by ID
export const getProduct = async (productId) => {
  try {
    const response = await api.get(`/products/${productId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching product:', error);
    throw error;
  }
};

// Function to update a product
export const updateProduct = async (productId, productData) => {
  try {
    const response = await api.put(`/products/${productId}/update/`, productData);
    return response.data;
  } catch (error) {
    console.error('Error updating product:', error);
    throw error;
  }
};

// Function to delete a product
export const deleteProduct = async (productId) => {
  try {
    const response = await api.delete(`/products/${productId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting product:', error);
    throw error;
  }
};

// ========== BRANCH CRUD OPERATIONS ==========

// Function to add a new branch
export const addBranch = async (branchData) => {
  try {
    const response = await api.post('/add-branch/', branchData);
    return response.data;
  } catch (error) {
    console.error('Error adding branch:', error);
    throw error;
  }
};

// Function to get a single branch by ID
export const getBranch = async (branchId) => {
  try {
    const response = await api.get(`/branches/${branchId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching branch:', error);
    throw error;
  }
};

// Function to update a branch
export const updateBranch = async (branchId, branchData) => {
  try {
    const response = await api.put(`/branches/${branchId}/update/`, branchData);
    return response.data;
  } catch (error) {
    console.error('Error updating branch:', error);
    throw error;
  }
};

// Function to delete a branch
export const deleteBranch = async (branchId) => {
  try {
    const response = await api.delete(`/branches/${branchId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting branch:', error);
    throw error;
  }
};

// ========== STOCK CRUD OPERATIONS ==========

// Function to add stock manually
export const addStock = async (stockData) => {
  try {
    const response = await api.post('/add-stock/', stockData);
    return response.data;
  } catch (error) {
    console.error('Error adding stock:', error);
    throw error;
  }
};

// Function to get a single stock record by ID
export const getStock = async (stockId) => {
  try {
    const response = await api.get(`/stock/${stockId}/`);
    return response.data;
  } catch (error) {
    console.error('Error fetching stock:', error);
    throw error;
  }
};

// Function to update stock
export const updateStock = async (stockId, stockData) => {
  try {
    const response = await api.put(`/stock/${stockId}/update/`, stockData);
    return response.data;
  } catch (error) {
    console.error('Error updating stock:', error);
    throw error;
  }
};

// Function to delete stock
export const deleteStock = async (stockId) => {
  try {
    const response = await api.delete(`/stock/${stockId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting stock:', error);
    throw error;
  }
};

// ========== SALE OPERATIONS ==========

// Function to delete a sale (restores stock)
export const deleteSale = async (saleId) => {
  try {
    const response = await api.delete(`/sales/${saleId}/delete/`);
    return response.data;
  } catch (error) {
    console.error('Error deleting sale:', error);
    throw error;
  }
};

// ========== AUTHENTICATION OPERATIONS ==========

// Function to login user
export const loginUser = async (username, password) => {
  try {
    const response = await api.post('/login/', { username, password });
    return response.data;
  } catch (error) {
    console.error('Error logging in:', error);
    throw error;
  }
};

// Function to logout user
export const logoutUser = async () => {
  try {
    const response = await api.post('/logout/');
    return response.data;
  } catch (error) {
    console.error('Error logging out:', error);
    throw error;
  }
};

// Function to check authentication status
export const checkAuth = async () => {
  try {
    const response = await api.get('/check-auth/');
    return response.data;
  } catch (error) {
    console.error('Error checking auth:', error);
    throw error;
  }
};

