import React from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

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
  white: '#FFFFFF',
};

// Modern Shopify-inspired navbar styles
const styles = {
  navbar: {
    position: 'sticky',
    top: 0,
    zIndex: 1000,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    backdropFilter: 'blur(10px)',
    WebkitBackdropFilter: 'blur(10px)',
    borderBottom: `1px solid ${colors.neutral[200]}`,
    boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)',
  },
  navbarScrolled: {
    boxShadow: '0 2px 8px rgba(0, 0, 0, 0.12)',
  },
  container: {
    maxWidth: '1280px',
    margin: '0 auto',
    padding: '0 24px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: '64px',
  },
  logo: {
    fontSize: '22px',
    fontWeight: '700',
    color: colors.neutral[700],
    textDecoration: 'none',
    letterSpacing: '-0.01em',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    transition: 'transform 0.2s ease',
  },
  logoAccent: {
    color: colors.primary,
  },
  navLinks: {
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
    flex: 1,
    justifyContent: 'center',
  },
  navLink: {
    fontSize: '15px',
    fontWeight: '500',
    color: colors.neutral[600],
    textDecoration: 'none',
    padding: '10px 16px',
    borderRadius: '8px',
    transition: 'all 0.2s ease',
    position: 'relative',
    letterSpacing: '0.01em',
  },
  navLinkActive: {
    color: colors.primary,
    backgroundColor: `${colors.primary}10`,
  },
  navLinkHover: {
    color: colors.primary,
    backgroundColor: colors.neutral[50],
  },
  actions: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  mobileMenuButton: {
    display: 'none',
    padding: '8px',
    backgroundColor: 'transparent',
    border: 'none',
    cursor: 'pointer',
    borderRadius: '8px',
    color: colors.neutral[600],
    fontSize: '20px',
  },
  mobileMenu: {
    display: 'none',
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: colors.white,
    borderTop: `1px solid ${colors.neutral[200]}`,
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
    padding: '16px 24px',
  },
  mobileMenuOpen: {
    display: 'block',
  },
  mobileNavLink: {
    display: 'block',
    fontSize: '15px',
    fontWeight: '500',
    color: colors.neutral[600],
    textDecoration: 'none',
    padding: '12px 0',
    borderBottom: `1px solid ${colors.neutral[200]}`,
    transition: 'color 0.2s ease',
  },
  mobileNavLinkActive: {
    color: colors.primary,
  },
  userInfo: {
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
  },
  userName: {
    fontSize: '14px',
    fontWeight: '500',
    color: colors.neutral[700],
  },
  logoutButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '500',
    backgroundColor: 'transparent',
    color: colors.neutral[600],
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
  },
  loginButton: {
    padding: '8px 16px',
    fontSize: '14px',
    fontWeight: '600',
    backgroundColor: colors.primary,
    color: colors.white,
    border: 'none',
    borderRadius: '8px',
    cursor: 'pointer',
    transition: 'all 0.2s ease',
    textDecoration: 'none',
    display: 'inline-block',
  },
};

// Navbar component with Shopify-inspired design
function Navbar() {
  const location = useLocation();
  const navigate = useNavigate();
  const { isAuthenticated, user, logout } = useAuth();
  const [scrolled, setScrolled] = React.useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const isActive = (path) => location.pathname === path;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const navItems = [
    { path: '/', label: 'Dashboard' },
    { path: '/products', label: 'Products' },
    { path: '/sales', label: 'Sales' },
    { path: '/branches', label: 'Branches' },
    { path: '/stock', label: 'Stock' },
  ];

  return (
    <>
      <style>{`
        .nav-link:hover {
          color: ${colors.primary};
          background-color: ${colors.neutral[50]};
          transform: translateY(-1px);
        }
        .nav-link-active {
          color: ${colors.primary};
          background-color: ${colors.primary}15;
          font-weight: 600;
        }
        .logo:hover {
          transform: scale(1.05);
        }
        .logo-gradient {
          background: linear-gradient(135deg, ${colors.neutral[700]} 0%, ${colors.primary} 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
        }
        .mobile-nav-link:hover {
          color: ${colors.primary};
        }
        .logout-button:hover {
          background-color: ${colors.neutral[100]};
          border-color: ${colors.neutral[400]};
        }
        .login-button:hover {
          background-color: ${colors.primaryHover};
          transform: translateY(-1px);
        }
        @media (max-width: 768px) {
          .nav-links {
            display: none !important;
          }
          .mobile-menu-button {
            display: block !important;
          }
        }
        @media (min-width: 769px) {
          .mobile-menu {
            display: none !important;
          }
        }
      `}</style>
      <nav style={{
        ...styles.navbar,
        ...(scrolled && styles.navbarScrolled)
      }}>
        <div style={styles.container}>
          {/* Logo */}
          <Link to="/" style={styles.logo} className="logo-gradient">
            Inventory System
          </Link>

          {/* Navigation Links - Desktop */}
          {isAuthenticated && (
            <div style={styles.navLinks} className="nav-links">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  style={{
                    ...styles.navLink,
                    ...(isActive(item.path) && styles.navLinkActive)
                  }}
                  className={`nav-link ${isActive(item.path) ? 'nav-link-active' : ''}`}
                >
                  {item.label}
                </Link>
              ))}
            </div>
          )}

          {/* Actions - Login/Logout */}
          <div style={styles.actions}>
            {isAuthenticated ? (
              <div style={styles.userInfo}>
                <span style={styles.userName}>{user?.name || 'User'}</span>
                <button
                  onClick={handleLogout}
                  style={styles.logoutButton}
                  className="logout-button"
                >
                  Logout
                </button>
              </div>
            ) : (
              location.pathname !== '/login' && (
                <Link to="/login" style={styles.loginButton} className="login-button">
                  Sign in
                </Link>
              )
            )}
          </div>

          {/* Mobile Menu Button */}
          {isAuthenticated && (
            <button
              style={styles.mobileMenuButton}
              className="mobile-menu-button"
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? '✕' : '☰'}
            </button>
          )}
        </div>

        {/* Mobile Menu */}
        <div style={{
          ...styles.mobileMenu,
          ...(mobileMenuOpen && styles.mobileMenuOpen)
        }} className="mobile-menu">
          {navItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              style={{
                ...styles.mobileNavLink,
                ...(isActive(item.path) && styles.mobileNavLinkActive)
              }}
              className={`mobile-nav-link ${isActive(item.path) ? 'mobile-nav-link-active' : ''}`}
              onClick={() => setMobileMenuOpen(false)}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
    </>
  );
}

export default Navbar;

