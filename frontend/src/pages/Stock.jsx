import { useState, useEffect } from 'react';
import { fetchStock, addStock, updateStock, deleteStock, fetchBranches, fetchProducts } from '../api';

// Shopify-inspired color palette
const colors = {
  primary: '#5C6AC4', // Shopify blue
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
  cardHover: {
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    transform: 'translateY(-2px)',
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
  inputFocus: {
    outline: 'none',
    borderColor: colors.primary,
    boxShadow: `0 0 0 3px ${colors.primary}15`,
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
  filterContainer: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '24px',
    marginBottom: '24px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
  },
  filterButtons: {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '10px',
    marginTop: '16px',
  },
  filterButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    whiteSpace: 'nowrap',
    backgroundColor: colors.white,
    color: colors.neutral[600],
  },
  filterButtonActive: {
    backgroundColor: colors.primary,
    color: colors.white,
    borderColor: colors.primary,
    boxShadow: '0 1px 2px rgba(0, 0, 0, 0.05)',
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
  tableRow: {
    transition: 'background-color 0.15s ease',
  },
  tableRowHover: {
    backgroundColor: colors.neutral[50],
  },
  cardMobile: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '20px',
    marginBottom: '16px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
    transition: 'all 0.3s ease',
  },
  cardRow: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.neutral[200]}`,
  },
  cardRowLast: {
    borderBottom: 'none',
    paddingBottom: 0,
  },
  cardLabel: {
    fontSize: '13px',
    fontWeight: '500',
    color: colors.neutral[500],
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  cardValue: {
    fontSize: '15px',
    fontWeight: '500',
    color: colors.neutral[700],
    textAlign: 'right',
  },
  actionButtons: {
    display: 'flex',
    gap: '10px',
    marginTop: '16px',
    paddingTop: '16px',
    borderTop: `1px solid ${colors.neutral[200]}`,
  },
  actionButton: {
    padding: '10px 20px',
    fontSize: '14px',
    fontWeight: '500',
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    flex: '1',
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
};

// Stock page: Shows a form to add/edit stock and a table displaying all stock records
function Stock() {
  // State to store the list of stock, branches, and products
  const [stockRecords, setStockRecords] = useState([]);
  const [branches, setBranches] = useState([]);
  const [products, setProducts] = useState([]);
  
  // State for the form inputs
  const [selectedBranch, setSelectedBranch] = useState('');
  const [selectedProduct, setSelectedProduct] = useState('');
  const [stockQuantity, setStockQuantity] = useState('');
  
  // State for editing
  const [editingStock, setEditingStock] = useState(null);
  
  // State for filtering by branch
  const [filteredBranchId, setFilteredBranchId] = useState(null);
  
  // State to show loading or error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch data from backend when component loads
  useEffect(() => {
    loadData();
  }, []);

  // Function to load all data from the API
  const loadData = async () => {
    try {
      setLoading(true);
      const [stockData, branchesData, productsData] = await Promise.all([
        fetchStock(),
        fetchBranches(),
        fetchProducts(),
      ]);
      setStockRecords(stockData);
      setBranches(branchesData);
      setProducts(productsData);
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
    if (!selectedBranch || !selectedProduct || !stockQuantity) {
      setMessage('Please fill in all fields');
      return;
    }

    const stockData = {
      branch: parseInt(selectedBranch),
      product: parseInt(selectedProduct),
      quantity: parseInt(stockQuantity),
    };

    try {
      setLoading(true);
      setMessage('');
      
      if (editingStock) {
        // Update existing stock
        await updateStock(editingStock.id, stockData);
        setMessage('Stock updated successfully!');
      } else {
        // Add stock (creates new or adds to existing)
        await addStock(stockData);
        setMessage('Stock added successfully! If stock already existed for this branch-product combination, quantity was added to existing stock.');
      }
      
      // Clear form inputs
      setSelectedBranch('');
      setSelectedProduct('');
      setStockQuantity('');
      setEditingStock(null);
      
      // Reload stock
      await loadData();
    } catch (error) {
      console.error('Stock operation error:', error);
      // Try to extract a meaningful error message
      let errorMessage = 'Error adding stock.';
      if (editingStock) {
        errorMessage = 'Error updating stock.';
      }
      
      if (error.response) {
        // Backend returned an error response
        if (error.response.data?.error) {
          errorMessage = error.response.data.error;
        } else if (error.response.data) {
          // Handle serializer errors or other error formats
          const errorData = error.response.data;
          if (typeof errorData === 'string') {
            errorMessage = errorData;
          } else if (typeof errorData === 'object') {
            // Format object errors into readable message
            const errorParts = [];
            for (const [key, value] of Object.entries(errorData)) {
              if (key === 'non_field_errors') {
                // Handle non-field errors (like unique constraint violations)
                if (Array.isArray(value)) {
                  errorParts.push(value.join(', '));
                } else {
                  errorParts.push(value);
                }
              } else {
                // Handle field-specific errors
                const fieldName = key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' ');
                if (Array.isArray(value)) {
                  errorParts.push(`${fieldName}: ${value.join(', ')}`);
                } else {
                  errorParts.push(`${fieldName}: ${value}`);
                }
              }
            }
            errorMessage = errorParts.length > 0 ? errorParts.join('; ') : errorMessage;
          }
        } else if (error.response.status === 404) {
          errorMessage = 'Branch or product not found. Please refresh the page and try again.';
        } else if (error.response.status >= 500) {
          errorMessage = 'Server error. Please try again later.';
        }
      } else if (error.request) {
        // Request was made but no response received
        errorMessage = 'Unable to connect to server. Please check your connection.';
      } else {
        // Error setting up the request
        errorMessage = `Error: ${error.message}`;
      }
      
      setMessage(errorMessage);
    } finally {
      setLoading(false);
    }
  };

  // Function to handle edit button click
  const handleEdit = (stock) => {
    setEditingStock(stock);
    setSelectedBranch(stock.branch);
    setSelectedProduct(stock.product);
    setStockQuantity(stock.quantity);
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingStock(null);
    setSelectedBranch('');
    setSelectedProduct('');
    setStockQuantity('');
    setMessage('');
  };

  // Function to handle delete
  const handleDelete = async (stockId) => {
    if (!window.confirm('Are you sure you want to delete this stock record?')) {
      return;
    }

    try {
      setLoading(true);
      await deleteStock(stockId);
      setMessage('Stock deleted successfully!');
      await loadData();
    } catch (error) {
      setMessage('Error deleting stock. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  // Function to filter stocks by branch
  const handleFilterByBranch = (branchId) => {
    setFilteredBranchId(branchId);
  };

  // Function to clear filter and show all stocks
  const handleShowAll = () => {
    setFilteredBranchId(null);
  };

  // Get filtered stock records
  // When showing all branches, aggregate by product and sum quantities
  // When showing a specific branch, show individual records
  const getFilteredStocks = () => {
    if (filteredBranchId === null) {
      // Aggregate by product - sum quantities across all branches
      const aggregated = {};
      stockRecords.forEach(stock => {
        const productId = stock.product;
        if (!aggregated[productId]) {
          aggregated[productId] = {
            product_id: productId,
            product_name: stock.product_name,
            total_quantity: 0,
            branches: [],
            stock_records: []
          };
        }
        aggregated[productId].total_quantity += stock.quantity;
        aggregated[productId].branches.push(stock.branch_name);
        aggregated[productId].stock_records.push(stock);
      });
      // Convert to array and sort by product name
      return Object.values(aggregated).sort((a, b) => 
        a.product_name.localeCompare(b.product_name)
      );
    }
    // When filtering by branch, show individual records
    return stockRecords.filter(stock => stock.branch === filteredBranchId);
  };

  // Get the selected branch name and location for display
  const getSelectedBranchInfo = () => {
    if (filteredBranchId === null) return null;
    const branch = branches.find(b => b.id === filteredBranchId);
    return branch ? `${branch.name} - ${branch.location}` : null;
  };

  return (
    <>
      <style>{`
        @media (max-width: 768px) {
          .desktop-table {
            display: none !important;
          }
          .mobile-cards {
            display: block !important;
          }
          .filter-button-text {
            display: none;
          }
          .filter-button-short {
            display: inline;
          }
          .stock-container {
            padding: 24px 16px !important;
          }
          .stock-card {
            padding: 24px !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-cards {
            display: none !important;
          }
          .filter-button-short {
            display: none;
          }
        }
        @media (max-width: 480px) {
          .stock-container {
            padding: 20px 12px !important;
          }
          .stock-card {
            padding: 20px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
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
        .filter-button:hover:not(.filter-button-active) {
          background-color: ${colors.neutral[50]};
          border-color: ${colors.neutral[400]};
        }
        .table-row:hover {
          background-color: ${colors.neutral[50]};
        }
      `}</style>
      <div style={styles.container} className="stock-container">
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Stock Management</h1>
          <p style={styles.pageSubtitle}>Manage inventory across all branches</p>
        </div>
      
      {/* Form to add/edit stock */}
        <div style={styles.card} className="stock-card">
          <h2 style={styles.sectionTitle}>{editingStock ? 'Edit Stock' : 'Add New Stock'}</h2>
        <form onSubmit={handleSubmit}>
            <div style={styles.formGrid} className="form-grid">
              <div style={styles.formGroup}>
                <label style={styles.label}>Branch</label>
            <select
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
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
              onChange={(e) => setSelectedProduct(e.target.value)}
                  style={styles.input}
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
              value={stockQuantity}
              onChange={(e) => setStockQuantity(e.target.value)}
                  style={styles.input}
                  placeholder="Enter quantity"
                  required
            />
              </div>
          </div>
          
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
              {loading ? (editingStock ? 'Updating...' : 'Adding...') : (editingStock ? 'Update Stock' : 'Add Stock')}
            </button>
            
            {editingStock && (
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

      {/* Branch Filter Buttons */}
        <div style={styles.filterContainer}>
          <h2 style={styles.sectionTitle}>Filter by Branch</h2>
          <div style={styles.filterButtons}>
          <button
            onClick={handleShowAll}
            style={{
                ...styles.filterButton,
                ...(filteredBranchId === null && styles.filterButtonActive)
              }}
              className={`filter-button ${filteredBranchId === null ? 'filter-button-active' : ''}`}
            >
              <span className="filter-button-text">View All Stocks</span>
              <span className="filter-button-short">All</span>
          </button>
          {branches.map((branch) => (
            <button
              key={branch.id}
              onClick={() => handleFilterByBranch(branch.id)}
              style={{
                  ...styles.filterButton,
                  ...(filteredBranchId === branch.id && styles.filterButtonActive)
                }}
                className={`filter-button ${filteredBranchId === branch.id ? 'filter-button-active' : ''}`}
              >
                <span className="filter-button-text">View Stocks in {branch.name} - {branch.location}</span>
                <span className="filter-button-short">{branch.name}</span>
            </button>
          ))}
        </div>
        {filteredBranchId !== null && (
            <p style={{ marginTop: '16px', color: colors.primary, fontWeight: '500', fontSize: '14px' }}>
            Showing stocks for: {getSelectedBranchInfo()}
          </p>
        )}
      </div>

      {/* Table to display stock records */}
      <div>
          <h2 style={{ ...styles.sectionTitle, marginBottom: '16px' }}>
            {filteredBranchId === null ? 'All Stock Records' : `Stock Records - ${getSelectedBranchInfo()}`}
          </h2>
        {loading && stockRecords.length === 0 ? (
            <div style={styles.loadingState}>Loading stock...</div>
        ) : (() => {
          const filteredStocks = getFilteredStocks();
          return filteredStocks.length === 0 ? (
              <div style={styles.emptyState}>
                <div style={styles.emptyStateText}>
              {filteredBranchId === null 
                ? 'No stock records found. Add your first stock record above!' 
                : `No stock records found for ${getSelectedBranchInfo()}.`}
                </div>
              </div>
          ) : filteredBranchId === null ? (
              <>
                {/* Desktop Table View - Aggregated */}
                <div style={styles.tableContainer} className="desktop-table">
                  <table style={styles.table}>
              <thead>
                      <tr>
                        <th style={styles.tableHeader}>Product</th>
                        <th style={styles.tableHeader}>Total Quantity</th>
                        <th style={styles.tableHeader}>Branches</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((aggregated) => (
                        <tr key={aggregated.product_id} className="table-row">
                          <td style={{ ...styles.tableCell, fontWeight: '600' }}>
                      {aggregated.product_name}
                    </td>
                          <td style={{ ...styles.tableCell, fontSize: '18px', fontWeight: '600', color: colors.primary }}>
                      {aggregated.total_quantity}
                    </td>
                          <td style={styles.tableCell}>
                      {aggregated.branches.join(', ')}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
                </div>

                {/* Mobile Card View - Aggregated */}
                <div className="mobile-cards" style={{ display: 'none' }}>
                  {filteredStocks.map((aggregated) => (
                    <div key={aggregated.product_id} style={styles.cardMobile}>
                      <div style={styles.cardRow}>
                        <span style={styles.cardLabel}>Product</span>
                        <span style={{ ...styles.cardValue, fontWeight: '600' }}>{aggregated.product_name}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span style={styles.cardLabel}>Total Quantity</span>
                        <span style={{ ...styles.cardValue, fontSize: '18px', fontWeight: '600', color: colors.primary }}>
                          {aggregated.total_quantity}
                        </span>
                      </div>
                      <div style={{ ...styles.cardRow, ...styles.cardRowLast }}>
                        <span style={styles.cardLabel}>Branches</span>
                        <span style={styles.cardValue}>{aggregated.branches.join(', ')}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </>
            ) : (
              <>
                {/* Desktop Table View - Individual Records */}
                <div style={styles.tableContainer} className="desktop-table">
                  <table style={styles.table}>
              <thead>
                      <tr>
                        <th style={styles.tableHeader}>ID</th>
                        <th style={styles.tableHeader}>Branch</th>
                        <th style={styles.tableHeader}>Product</th>
                        <th style={styles.tableHeader}>Quantity</th>
                        <th style={styles.tableHeader}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredStocks.map((stock) => (
                        <tr key={stock.id} className="table-row">
                          <td style={styles.tableCell}>{stock.id}</td>
                          <td style={styles.tableCell}>{stock.branch_name}</td>
                          <td style={styles.tableCell}>{stock.product_name}</td>
                          <td style={{ ...styles.tableCell, fontWeight: '600', color: colors.primary }}>
                            {stock.quantity}
                          </td>
                          <td style={styles.tableCell}>
                            <div style={{ display: 'flex', gap: '8px' }}>
                      <button
                        onClick={() => handleEdit(stock)}
                        style={{
                                  ...styles.actionButton,
                                  backgroundColor: colors.primary,
                                  color: colors.white,
                                  padding: '8px 16px',
                                }}
                                className="button-primary"
                      >
                        Edit
                      </button>
                      <button
                        onClick={() => handleDelete(stock.id)}
                        style={{
                                  ...styles.actionButton,
                                  backgroundColor: colors.error,
                                  color: colors.white,
                                  padding: '8px 16px',
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

                {/* Mobile Card View - Individual Records */}
                <div className="mobile-cards" style={{ display: 'none' }}>
                  {filteredStocks.map((stock) => (
                    <div key={stock.id} style={styles.cardMobile}>
                      <div style={styles.cardRow}>
                        <span style={styles.cardLabel}>ID</span>
                        <span style={styles.cardValue}>{stock.id}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span style={styles.cardLabel}>Branch</span>
                        <span style={styles.cardValue}>{stock.branch_name}</span>
                      </div>
                      <div style={styles.cardRow}>
                        <span style={styles.cardLabel}>Product</span>
                        <span style={styles.cardValue}>{stock.product_name}</span>
                      </div>
                      <div style={{ ...styles.cardRow, ...styles.cardRowLast }}>
                        <span style={styles.cardLabel}>Quantity</span>
                        <span style={{ ...styles.cardValue, fontSize: '18px', fontWeight: '600', color: colors.primary }}>
                          {stock.quantity}
                        </span>
                      </div>
                      <div style={styles.actionButtons}>
                        <button
                          onClick={() => handleEdit(stock)}
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
                          onClick={() => handleDelete(stock.id)}
                          style={{
                            ...styles.actionButton,
                            backgroundColor: colors.error,
                            color: colors.white,
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </>
          );
        })()}
      </div>
    </div>
    </>
  );
}

export default Stock;
