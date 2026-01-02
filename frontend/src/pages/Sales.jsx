import { useState, useEffect } from 'react';
import { recordSale, fetchProducts, fetchStock, fetchBranches } from '../api';

// Shopify-inspired color palette
const colors = {
  primary: '#5C6AC4',
  primaryHover: '#4C5AB4',
  neutral: {
    50: '#FAFBFC',
    100: '#F4F6F8',
    200: '#DFE3E8',
    300: '#C4CDD5',
    400: '#919EAB',
    500: '#637381',
    600: '#454F5B',
    700: '#212B36',
  },
  success: '#47C1BF',
  error: '#BF0711',
  white: '#FFFFFF',
};

// Modern Shopify-inspired styles
const styles = {
  container: {
    padding: '40px 24px',
    maxWidth: '800px',
    margin: '0 auto',
    backgroundColor: colors.neutral[50],
    minHeight: '100vh',
  },
  pageHeader: {
    marginBottom: '32px',
  },
  pageTitle: {
    fontSize: '32px',
    fontWeight: '700',
    color: colors.neutral[700],
    marginBottom: '8px',
    letterSpacing: '-0.02em',
  },
  pageSubtitle: {
    fontSize: '16px',
    color: colors.neutral[500],
    fontWeight: '400',
  },
  card: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '32px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  formGroup: {
    marginBottom: '24px',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: '8px',
    display: 'block',
    letterSpacing: '0.01em',
  },
  input: {
    width: '100%',
    padding: '12px 16px',
    fontSize: '15px',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '8px',
    backgroundColor: colors.white,
    color: colors.neutral[700],
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  inputDisabled: {
    backgroundColor: colors.neutral[50],
    color: colors.neutral[400],
    cursor: 'not-allowed',
  },
  buttonPrimary: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
    width: '100%',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '20px',
    padding: '16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    lineHeight: '1.5',
  },
  messageSuccess: {
    backgroundColor: `${colors.success}15`,
    color: '#0A5D5C',
    border: `1px solid ${colors.success}40`,
  },
  messageError: {
    backgroundColor: '#FEF2F2',
    color: colors.error,
    border: `1px solid ${colors.error}40`,
  },
  stockInfo: {
    marginTop: '8px',
    fontSize: '14px',
    color: colors.neutral[600],
    fontWeight: '500',
  },
  stockInfoAvailable: {
    color: colors.success,
  },
  stockInfoLow: {
    color: colors.error,
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
    position: 'relative',
    overflow: 'hidden',
  },
  infoTitle: {
    fontSize: '18px',
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: '16px',
    letterSpacing: '-0.01em',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: 0,
  },
  infoListItem: {
    fontSize: '15px',
    color: colors.neutral[600],
    lineHeight: '1.8',
    paddingLeft: '24px',
    position: 'relative',
    marginBottom: '12px',
  },
  infoListItemBefore: {
    content: '""',
    position: 'absolute',
    left: 0,
    top: '10px',
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    backgroundColor: colors.primary,
  },
  loadingState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: colors.neutral[500],
    fontSize: '15px',
  },
};

// Sales page: Form to record a sale
// When a sale is recorded, stock is automatically reduced in the backend
function Sales() {
  // State to store available branches, products, and stock
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  const [stock, setStock] = useState([]);
  
  // State for the form inputs
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [quantity, setQuantity] = useState('');
  
  // State to show loading or error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data when component loads
  useEffect(() => {
    loadData();
  }, []);

  // Function to load branches, products, and stock from the API
  const loadData = async () => {
    try {
      setLoading(true);
      
      // Fetch branches, products, and stock from the API
      const [branchesData, productsData, stockData] = await Promise.all([
        fetchBranches(),
        fetchProducts(),
        fetchStock(),
      ]);
      
      setBranches(branchesData);
      setProducts(productsData);
      setStock(stockData);
    } catch (error) {
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Function to get available stock for selected branch and product
  const getAvailableStock = () => {
    if (!selectedBranch || !selectedProduct) return 0;
    const stockItem = stock.find(
      (s) => s.branch === parseInt(selectedBranch) && s.product === parseInt(selectedProduct)
    );
    return stockItem ? stockItem.quantity : 0;
  };

  // Function to handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!selectedBranch || !selectedProduct || !quantity) {
      setMessage('Please fill in all fields');
      return;
    }

    const saleQuantity = parseInt(quantity);
    const availableStock = getAvailableStock();

    // Check if there's enough stock
    if (saleQuantity > availableStock) {
      setMessage(`Not enough stock. Available: ${availableStock}`);
      return;
    }

    try {
      setLoading(true);
      setMessage('');
      
      // Send sale data to backend
      await recordSale({
        branch: parseInt(selectedBranch),
        product: parseInt(selectedProduct),
        quantity: saleQuantity,
      });
      
      // Clear form inputs
      setSelectedBranch('');
      setSelectedProduct('');
      setQuantity('');
      
      // Reload stock to show updated quantities
      await loadData();
      setMessage('Sale recorded successfully! Stock has been updated.');
    } catch (error) {
      setMessage(error.response?.data?.error || 'Error recording sale. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const availableStock = getAvailableStock();

  return (
    <>
      <style>{`
        input:focus, select:focus {
          outline: none;
          border-color: ${colors.primary};
          box-shadow: 0 0 0 3px ${colors.primary}15;
        }
        button:hover:not(:disabled) {
          transform: translateY(-1px);
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
        }
        .button-primary:hover:not(:disabled) {
          background-color: ${colors.primaryHover};
        }
        @media (max-width: 768px) {
          .sales-container {
            padding: 24px 16px !important;
          }
        }
      `}</style>
      <div style={styles.container} className="sales-container">
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Record Sale</h1>
          <p style={styles.pageSubtitle}>Record a sale and automatically update inventory</p>
        </div>
        
        {/* Form to record a sale */}
        <div style={styles.card}>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Branch</label>
              <select
                value={selectedBranch}
                onChange={(e) => {
                  setSelectedBranch(e.target.value);
                  setSelectedProduct('');
                  setQuantity('');
                }}
                style={styles.input}
                required
              >
                <option value="">Select a branch</option>
                {branches.map((branch) => (
                  <option key={branch.id} value={branch.id}>
                    {branch.name} - {branch.location}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Product</label>
              <select
                value={selectedProduct}
                onChange={(e) => {
                  setSelectedProduct(e.target.value);
                  setQuantity('');
                }}
                disabled={!selectedBranch}
                style={{
                  ...styles.input,
                  ...(!selectedBranch && styles.inputDisabled)
                }}
                required
              >
                <option value="">Select a product</option>
                {products.map((product) => (
                  <option key={product.id} value={product.id}>
                    {product.name} - ₹{product.price.toLocaleString('en-IN')}
                  </option>
                ))}
              </select>
            </div>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Quantity</label>
              <input
                type="number"
                min="1"
                max={availableStock}
                value={quantity}
                onChange={(e) => setQuantity(e.target.value)}
                style={styles.input}
                placeholder="Enter quantity"
                required
              />
              {selectedBranch && selectedProduct && (
                <div style={{
                  ...styles.stockInfo,
                  ...(availableStock > 0 ? styles.stockInfoAvailable : styles.stockInfoLow)
                }}>
                  Available stock: {availableStock}
                </div>
              )}
            </div>
            
            <button
              type="submit"
              disabled={loading || !selectedBranch || !selectedProduct || availableStock === 0}
              style={{
                ...styles.buttonPrimary,
                ...((loading || !selectedBranch || !selectedProduct || availableStock === 0) && styles.buttonDisabled)
              }}
              className="button-primary"
            >
              {loading ? 'Recording...' : 'Record Sale'}
            </button>
          </form>
          
          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('Error') || message.includes('Not enough') ? styles.messageError : styles.messageSuccess)
            }}>
              {message}
            </div>
          )}
        </div>

        <div style={styles.infoCard}>
          <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '4px',
            height: '100%',
            background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.primaryHover} 100%)`,
          }}></div>
          <div style={{ paddingLeft: '20px' }}>
            <h3 style={styles.infoTitle}>How it works:</h3>
            <ul style={styles.infoList}>
              <li style={styles.infoListItem}>1. Select a branch and product</li>
              <li style={styles.infoListItem}>2. Enter the quantity sold</li>
              <li style={styles.infoListItem}>3. Click "Record Sale" - the stock will be automatically reduced!</li>
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}

export default Sales;
