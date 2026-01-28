import { useState, useEffect } from 'react';
import { fetchBranches, addBranch, updateBranch, deleteBranch } from '../api';

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
};

// Branches page: Shows a form to add/edit branches and a table displaying all branches
function Branches() {
  // State to store the list of branches
  const [branches, setBranches] = useState([]);
  
  // State for the form inputs
  const [branchName, setBranchName] = useState('');
  const [branchLocation, setBranchLocation] = useState('');
  
  // State for editing
  const [editingBranch, setEditingBranch] = useState(null);
  
  // State to show loading or error messages
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  // Fetch branches from backend when component loads
  useEffect(() => {
    loadBranches();
  }, []);

  // Function to load all branches from the API
  const loadBranches = async () => {
    try {
      setLoading(true);
      const data = await fetchBranches();
      setBranches(data);
    } catch (error) {
      setMessage('Error loading branches');
    } finally {
      setLoading(false);
    }
  };

  // Function to handle form submission (Create or Update)
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form inputs
    if (!branchName || !branchLocation) {
      setMessage('Please fill in all fields');
      return;
    }

    const branchData = {
      name: branchName,
      location: branchLocation,
    };

    try {
      setLoading(true);
      setMessage('');
      
      if (editingBranch) {
        // Update existing branch
        await updateBranch(editingBranch.id, branchData);
        setMessage('Branch updated successfully!');
      } else {
        // Create new branch
        await addBranch(branchData);
        setMessage('Branch added successfully!');
      }
      
      // Clear form inputs
      setBranchName('');
      setBranchLocation('');
      setEditingBranch(null);
      
      // Reload branches
      await loadBranches();
    } catch (error) {
      setMessage(error.response?.data?.error || (editingBranch ? 'Error updating branch.' : 'Error adding branch.'));
    } finally {
      setLoading(false);
    }
  };

  // Function to handle edit button click
  const handleEdit = (branch) => {
    setEditingBranch(branch);
    setBranchName(branch.name);
    setBranchLocation(branch.location);
  };

  // Function to handle cancel edit
  const handleCancelEdit = () => {
    setEditingBranch(null);
    setBranchName('');
    setBranchLocation('');
    setMessage('');
  };

  // Function to handle delete
  const handleDelete = async (branchId) => {
    if (!window.confirm('Are you sure you want to delete this branch? This will also delete all related stock and sales records.')) {
      return;
    }

    try {
      setLoading(true);
      await deleteBranch(branchId);
      setMessage('Branch deleted successfully!');
      await loadBranches();
    } catch (error) {
      setMessage('Error deleting branch. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{`
        input:focus {
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
        }
        @media (max-width: 768px) {
          .branches-container {
            padding: 24px 16px !important;
          }
          .form-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
      <div style={styles.container} className="branches-container">
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Branches Management</h1>
          <p style={styles.pageSubtitle}>Manage your store locations</p>
        </div>
        
        {/* Form to add/edit a branch */}
        <div style={styles.card}>
          <h2 style={styles.sectionTitle}>{editingBranch ? 'Edit Branch' : 'Add New Branch'}</h2>
          <form onSubmit={handleSubmit}>
            <div style={styles.formGrid} className="form-grid">
              <div style={styles.formGroup}>
                <label style={styles.label}>Branch Name</label>
                <input
                  type="text"
                  value={branchName}
                  onChange={(e) => setBranchName(e.target.value)}
                  style={styles.input}
                  placeholder="Enter branch name"
                  required
                />
              </div>
              
              <div style={styles.formGroup}>
                <label style={styles.label}>Location</label>
                <input
                  type="text"
                  value={branchLocation}
                  onChange={(e) => setBranchLocation(e.target.value)}
                  style={styles.input}
                  placeholder="Enter branch location"
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
                {loading ? (editingBranch ? 'Updating...' : 'Adding...') : (editingBranch ? 'Update Branch' : 'Add Branch')}
              </button>
              
              {editingBranch && (
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

        {/* Table to display all branches */}
        <div>
          <h2 style={styles.sectionTitle}>All Branches</h2>
          {loading && branches.length === 0 ? (
            <div style={styles.loadingState}>Loading branches...</div>
          ) : branches.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyStateText}>No branches found. Add your first branch above!</div>
            </div>
          ) : (
            <div style={styles.tableContainer}>
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.tableHeader}>ID</th>
                    <th style={styles.tableHeader}>Name</th>
                    <th style={styles.tableHeader}>Location</th>
                    <th style={styles.tableHeader}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {branches.map((branch) => (
                    <tr key={branch.id} className="table-row">
                      <td style={styles.tableCell}>{branch.id}</td>
                      <td style={styles.tableCell}>{branch.name}</td>
                      <td style={styles.tableCell}>{branch.location}</td>
                      <td style={styles.tableCell}>
                        <div style={styles.actionButtons}>
                          <button
                            onClick={() => handleEdit(branch)}
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
                            onClick={() => handleDelete(branch.id)}
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

export default Branches;
