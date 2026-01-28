import { useState, useEffect } from 'react';
import { fetchProducts, fetchStock, fetchSales, fetchBranches } from '../api';

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
  accent: {
    blue: '#006FBB',
    purple: '#7C3AED',
    orange: '#F59E0B',
    green: '#10B981',
  },
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
    marginBottom: '40px',
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
  statsGrid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
    gap: '24px',
    marginBottom: '40px',
  },
  statCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '32px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
    position: 'relative',
    overflow: 'hidden',
  },
  statCardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    height: '4px',
    background: 'linear-gradient(90deg, #5C6AC4 0%, #7C3AED 100%)',
  },
  statCardHover: {
    transform: 'translateY(-4px)',
    boxShadow: '0 8px 24px rgba(0, 0, 0, 0.12)',
  },
  statValue: {
    fontSize: '52px',
    fontWeight: '700',
    color: colors.primary,
    marginBottom: '8px',
    lineHeight: '1',
    letterSpacing: '-0.02em',
  },
  statLabel: {
    fontSize: '16px',
    fontWeight: '500',
    color: colors.neutral[600],
    marginBottom: '4px',
  },
  statSubtext: {
    fontSize: '13px',
    color: colors.neutral[500],
    marginTop: '8px',
    lineHeight: '1.4',
  },
  infoCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '40px',
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.06)',
    border: `1px solid ${colors.neutral[200]}`,
    position: 'relative',
    overflow: 'hidden',
  },
  infoCardAccent: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '4px',
    height: '100%',
    background: `linear-gradient(180deg, ${colors.primary} 0%, ${colors.accent.purple} 100%)`,
  },
  infoTitle: {
    fontSize: '20px',
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: '20px',
    letterSpacing: '-0.01em',
  },
  infoText: {
    fontSize: '15px',
    color: colors.neutral[600],
    lineHeight: '1.6',
    marginBottom: '16px',
  },
  infoList: {
    listStyle: 'none',
    padding: 0,
    margin: '20px 0',
  },
  infoListItem: {
    fontSize: '15px',
    color: colors.neutral[600],
    lineHeight: '1.8',
    paddingLeft: '28px',
    position: 'relative',
    marginBottom: '12px',
  },
  infoNote: {
    fontSize: '14px',
    fontStyle: 'italic',
    color: colors.neutral[500],
    marginTop: '20px',
    padding: '16px',
    backgroundColor: colors.neutral[50],
    borderRadius: '8px',
    border: `1px solid ${colors.neutral[200]}`,
  },
  loadingState: {
    textAlign: 'center',
    padding: '60px 20px',
    color: colors.neutral[500],
    fontSize: '16px',
  },
};

// Dashboard page: Shows summary statistics
// Displays total number of products and total sales count
function Dashboard() {
  // State to store statistics
  const [totalProducts, setTotalProducts] = useState(0);
  const [totalSales, setTotalSales] = useState(0);
  const [totalBranches, setTotalBranches] = useState(0);
  const [totalStockItems, setTotalStockItems] = useState(0);
  const [loading, setLoading] = useState(true);

  // Fetch data when component loads
  useEffect(() => {
    loadStatistics();
  }, []);

  // Function to load statistics from the API
  const loadStatistics = async () => {
    try {
      setLoading(true);
      
      // Fetch products to count them
      const products = await fetchProducts();
      setTotalProducts(products.length);
      
      // Fetch branches to count them (this is what "Stock Locations" should show)
      const branches = await fetchBranches();
      setTotalBranches(branches.length);
      
      // Fetch stock to count total stock records
      const stock = await fetchStock();
      setTotalStockItems(stock.length);
      
      // Fetch sales to count total sales
      const sales = await fetchSales();
      setTotalSales(sales.length);
      
    } catch (error) {
      console.error('Error loading statistics:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div style={styles.container}>
        <div style={styles.loadingState}>Loading dashboard...</div>
      </div>
    );
  }

  return (
    <>
      <style>{`
        .stat-card {
          cursor: pointer;
        }
        .stat-card:hover {
          transform: translateY(-6px) scale(1.02);
          box-shadow: 0 12px 32px rgba(92, 106, 196, 0.15);
        }
        .stat-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          height: 4px;
          background: linear-gradient(90deg, #5C6AC4 0%, #7C3AED 100%);
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        .stat-card:hover::before {
          opacity: 1;
        }
        @keyframes fadeInUp {
          from {
            opacity: 0;
            transform: translateY(20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .stat-card {
          animation: fadeInUp 0.5s ease forwards;
        }
        .stat-card:nth-child(1) { animation-delay: 0.1s; }
        .stat-card:nth-child(2) { animation-delay: 0.2s; }
        .stat-card:nth-child(3) { animation-delay: 0.3s; }
        .stat-card:nth-child(4) { animation-delay: 0.4s; }
        .info-list-item::before {
          content: '';
          position: absolute;
          left: 0;
          top: 12px;
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: linear-gradient(135deg, #5C6AC4 0%, #7C3AED 100%);
        }
        .stat-value-gradient {
          background: linear-gradient(135deg, #5C6AC4 0%, #7C3AED 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        @media (max-width: 768px) {
          .dashboard-container {
            padding: 24px 16px !important;
          }
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 16px !important;
          }
        }
      `}</style>
      <div style={styles.container} className="dashboard-container">
        <div style={styles.pageHeader}>
          <h1 style={styles.pageTitle}>Inventory Dashboard</h1>
          <p style={styles.pageSubtitle}>Overview of your inventory system</p>
        </div>
        
        <div style={styles.statsGrid} className="stats-grid">
          {/* Total Products Card */}
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statValue} className="stat-value-gradient">{totalProducts}</div>
            <div style={styles.statLabel}>Total Products</div>
          </div>

          {/* Total Branches Card */}
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statValue} className="stat-value-gradient">{totalBranches}</div>
            <div style={styles.statLabel}>Total Branches</div>
          </div>

          {/* Total Stock Records Card */}
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statValue} className="stat-value-gradient">{totalStockItems}</div>
            <div style={styles.statLabel}>Stock Records</div>
            <div style={styles.statSubtext}>
              (Product-Branch combinations)
            </div>
          </div>

          {/* Total Sales Card */}
          <div style={styles.statCard} className="stat-card">
            <div style={styles.statValue} className="stat-value-gradient">{totalSales}</div>
            <div style={styles.statLabel}>Total Sales</div>
            <div style={styles.statSubtext}>
              (Sales are tracked when recorded)
            </div>
          </div>
      </div>

        <div style={styles.infoCard}>
          <div style={styles.infoCardAccent}></div>
          <div style={{ paddingLeft: '20px' }}>
            <h2 style={styles.infoTitle}>System Overview</h2>
            <p style={styles.infoText}>This inventory management system helps you:</p>
            <ul style={styles.infoList}>
              <li style={styles.infoListItem} className="info-list-item">Track products and their prices</li>
              <li style={styles.infoListItem} className="info-list-item">Monitor stock levels at different branches</li>
              <li style={styles.infoListItem} className="info-list-item">Record sales and automatically update inventory</li>
              <li style={styles.infoListItem} className="info-list-item">View summary statistics on this dashboard</li>
        </ul>
            <div style={styles.infoNote}>
          When a sale is recorded, the stock quantity is automatically reduced in the database.
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

export default Dashboard;
