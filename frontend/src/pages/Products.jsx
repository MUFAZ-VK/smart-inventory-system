import { useState, useEffect } from 'react';
import { fetchProducts, addProduct, updateProduct, deleteProduct, fetchBranches } from '../api';

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
    maxWidth: '1280px',
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
  sectionTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: '24px',
    letterSpacing: '-0.01em',
  },
  formGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
    gap: '20px',
    marginBottom: '24px',
  },
  formGroup: {
    display: 'flex',
    flexDirection: 'column',
  },
  label: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.neutral[700],
    marginBottom: '8px',
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
  infoBox: {
    padding: '16px',
    backgroundColor: `${colors.primary}10`,
    borderRadius: '8px',
    border: `1px solid ${colors.primary}30`,
    marginBottom: '24px',
  },
  infoText: {
    fontSize: '14px',
    color: colors.primary,
    lineHeight: '1.6',
    margin: 0,
  },
  buttonGroup: {
    display: 'flex',
    gap: '12px',
    flexWrap: 'wrap',
    marginTop: '8px',
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
  },
  buttonSecondary: {
    padding: '12px 24px',
    fontSize: '15px',
    fontWeight: '600',
    backgroundColor: 'transparent',
    color: colors.neutral[600],
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    letterSpacing: '0.01em',
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
  tableContainer: {
    overflowX: 'auto',
    width: '100%',
    borderRadius: '16px',
    border: `1px solid ${colors.neutral[200]}`,
    backgroundColor: colors.white,
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    transition: 'box-shadow 0.3s ease',
  },
  table: {
    width: '100%',
    borderCollapse: 'separate',
    borderSpacing: 0,
    minWidth: '600px',
  },
  tableHeader: {
    backgroundColor: colors.neutral[50],
    padding: '16px 20px',
    textAlign: 'left',
    fontWeight: '600',
    fontSize: '13px',
    color: colors.neutral[600],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
    borderBottom: `1px solid ${colors.neutral[200]}`,
  },
  tableCell: {
    padding: '16px 20px',
    borderBottom: `1px solid ${colors.neutral[200]}`,
    fontSize: '15px',
    color: colors.neutral[700],
  },
  actionButtons: {
    display: 'flex',
    gap: '8px',
  },
  actionButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  emptyState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.neutral[500],
  },
  emptyStateText: {
    fontSize: '16px',
    marginTop: '12px',
  },
  loadingState: {
    textAlign: 'center',
    padding: '40px 20px',
    color: colors.neutral[500],
    fontSize: '15px',
  },
  helperText: {
    fontSize: '13px',
    color: colors.neutral[500],
    marginTop: '6px',
    lineHeight: '1.4',
  },
};

// Products page: Shows a form to add/edit products and a table displaying all products
function Products() {
  // State to store the list of products and branches
  const [products, setProducts] = useState([]);
  const [branches, setBranches] = useState([]);
  
  // State for the form inputs
  const [productName, setProductName] = useState('');
  const [productPrice, setProductPrice] = useState('');
  const [selectedBranch, setSelectedBranch] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  
  // State for editing
  const [editingProduct, setEditingProduct] = useState(null);
  
  // State to show loading or error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch products and branches from backend when component loads
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all products and branches from the API
  const loadData = async () => {
    try {
      setLoading(true);
      const [productsData, branchesData] = await Promise.all([
        fetchProducts(),
        fetchBranches(),
      ]);
      setProducts(productsData);
      setBranches(branchesData);
    } catch (error) {
      setMessage('Error loading data');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!productName || !productPrice) {
      setMessage('Please fill in product name and price');
      return;
    }

    const productData = {
      name: productName,
      price: parseFloat(productPrice),
    };

    // For new products, branch and stock quantity are OPTIONAL
    // If provided, creates initial stock for that branch
    // Product itself is global and available to all branches
    if (!editingProduct && selectedBranch && stockQuantity) {
      productData.branch = parseInt(selectedBranch);
      productData.stock_quantity = parseInt(stockQuantity);
    }

    try {
      setLoading(true);
      setMessage('');
      
      if (editingProduct) {
        // Update existing product
        await updateProduct(editingProduct.id, productData);
        setMessage('Product updated successfully!');
      } else {
        // Create new product
        await addProduct(productData);
        if (selectedBranch && stockQuantity) {
          setMessage('Product added successfully! Stock has been added to the selected branch.');
        } else {
          setMessage('Product added successfully! You can add stock for this product in the Stock management page.');
        }
      }
      
      // Clear form inputs
      setProductName('');
      setProductPrice('');
      setSelectedBranch('');
      setStockQuantity('');
      setEditingProduct(null);
      
      // Reload products
      await loadData();
    } catch (error) {
      setMessage(error.response?.data?.error || (editingProduct ? 'Error updating product.' : 'Error adding product.'));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle edit button click
  const handleEdit = (product) => {
    setEditingProduct(product);
    setProductName(product.name);
    setProductPrice(product.price);
    // Don't set branch/stock for editing (those are managed separately)
    setSelectedBranch('');
    setStockQuantity('');
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingProduct(null);
    setProductName('');
    setProductPrice('');
    setSelectedBranch('');
    setStockQuantity('');
    setMessage('');
  };

  // Function to handle delete
  const handleDelete = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product? This will also delete all related stock records.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteProduct(productId);
      setMessage('Product deleted successfully!');
      await loadData();
    } catch (error) {
      setMessage('Error deleting product. Please try again.');
    } finally {
      setLoading(false);
    }
  };

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
        .button-secondary:hover:not(:disabled) {
          background-color: ${colors.neutral[100]};
          border-color: ${colors.neutral[400]};
        }
        .table-row:hover {
          background-color: ${colors.neutral[50]};
          transform: scale(1.01);
        }
        .table-container:hover {
          box-shadow: 0 4px 12px rgba(0, 0, 0, 0.1);
        }
        @keyframes slideIn {
          from {
            opacity: 0;
            transform: translateX(-10px);
          }
          to {
            opacity: 1;
            transform: translateX(0);
          }
        }
        .table-row {
          animation: slideIn 0.3s ease forwards;
        }
        @media (max-width: 768px) {
          .products-container {
            padding: 24px 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={styles.container} className="products-container">
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Products Management</h1>
          <p style={styles.pageSubtitle}>Manage your product catalog</p>
        </div>
        
        {/* Form to add/edit a product */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>{editingProduct ? 'Edit Product' : 'Add New Product'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid} className="form-grid">
              <div style={styles.formGroup}>
                <label style={styles.label}>Product Name</label>
                <input
                  type="text"
                  value={productName}
                  onChange={(e) => setProductName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter product name"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Price (INR)</label>
                <input
                  type="number"
                  step="0.01"
                  value={productPrice}
                  onChange={(e) => setProductPrice(e.target.value)}
                  style={styles.input}
                  placeholder="Enter price in INR"
                  required
                />
              </div>
            </div>
            
            {!editingProduct && (
              <>
                <div style={styles.infoBox}>
                  <p style={styles.infoText}>
                    <strong>Note:</strong> Products are global and available to all branches. 
                    You can optionally add initial stock for a specific branch below, or add stock later in the Stock management page.
                  </p>
                </div>
                
                <div style={styles.formGrid} className="form-grid">
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Branch (Optional - for initial stock)</label>
                    <select
                      value={selectedBranch}
                      onChange={(e) => setSelectedBranch(e.target.value)}
                      style={styles.input}
                    >
                      <option value="">Select a branch (optional)</option>
                      {branches.map((branch) => (
                        <option key={branch.id} value={branch.id}>
                          {branch.name} - {branch.location}
                        </option>
                      ))}
                    </select>
                    <div style={styles.helperText}>
                      If selected, initial stock will be created for this branch
                    </div>
                  </div>
                  
                  <div style={styles.formGroup}>
                    <label style={styles.label}>Initial Stock Quantity (Optional)</label>
                    <input
                      type="number"
                      min="0"
                      value={stockQuantity}
                      onChange={(e) => setStockQuantity(e.target.value)}
                      style={styles.input}
                      placeholder="Enter initial stock quantity"
                      disabled={!selectedBranch}
                    />
                    {!selectedBranch && (
                      <div style={styles.helperText}>
                        Select a branch first to add initial stock
                      </div>
                    )}
                    {selectedBranch && (
                      <div style={styles.helperText}>
                        Enter the initial stock quantity for the selected branch
                      </div>
                    )}
                  </div>
                </div>
              </>
            )}
            
            <div style={styles.buttonGroup}>
              <button
                type="submit"
                disabled={loading}
                style={{
                  ...styles.buttonPrimary,
                  ...(loading && styles.buttonDisabled)
                }}
                className="button-primary"
              >
                {loading ? (editingProduct ? 'Updating...' : 'Adding...') : (editingProduct ? 'Update Product' : 'Add Product')}
              </button>
              
              {editingProduct && (
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  disabled={loading}
                  style={{
                    ...styles.buttonSecondary,
                    ...(loading && styles.buttonDisabled)
                  }}
                  className="button-secondary"
                >
                  Cancel
                </button>
              )}
            </div>
          </form>
          
          {message && (
            <div style={{
              ...styles.message,
              ...(message.includes('Error') ? styles.messageError : styles.messageSuccess)
            }}>
              {message}
            </div>
          )}
        </div>

        {/* Table to display all products */}
        <div>
          <h2 style={styles.sectionTitle}>All Products</h2>
          {loading && products.length === 0 ? (
            <div style={styles.loadingState}>Loading products...</div>
          ) : products.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateText}>No products found. Add your first product above!</div>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>ID</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Price</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr key={product.id} className="table-row">
                      <td style={styles.tableCell}>{product.id}</td>
                      <td style={styles.tableCell}>{product.name}</td>
                      <td style={{ ...styles.tableCell, fontWeight: '600', color: colors.primary }}>
                        ₹{product.price.toLocaleString('en-IN')}
                      </td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleEdit(product)}
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.primary,
                              color: colors.white,
                            }}
                            className="button-primary"
                          >
                            Edit
                          </button>
                          <button
                            onClick={() => handleDelete(product.id)}
                            style={{
                              ...styles.actionButton,
                              backgroundColor: colors.error,
                              color: colors.white,
                            }}
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

export default Products;
