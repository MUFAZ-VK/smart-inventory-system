import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
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
  success: '#47C1BF',
  error: '#BF0711',
  white: '#FFFFFF',
};

// Modern Shopify-inspired styles
const styles = {
  container: {
    minHeight: '100vh',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: colors.neutral[50],
    padding: '20px',
  },
  loginCard: {
    backgroundColor: colors.white,
    borderRadius: '16px',
    padding: '48px',
    width: '100%',
    maxWidth: '440px',
    boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)',
    border: `1px solid ${colors.neutral[200]}`,
  },
  logo: {
    textAlign: 'center',
    marginBottom: '32px',
  },
  logoText: {
    fontSize: '28px',
    fontWeight: '700',
    color: colors.neutral[700],
    letterSpacing: '-0.02em',
    marginBottom: '8px',
  },
  logoSubtext: {
    fontSize: '16px',
    color: colors.neutral[500],
    fontWeight: '400',
  },
  title: {
    fontSize: '24px',
    fontWeight: '600',
    color: colors.neutral[700],
    marginBottom: '8px',
    letterSpacing: '-0.01em',
  },
  subtitle: {
    fontSize: '15px',
    color: colors.neutral[500],
    marginBottom: '32px',
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
    padding: '14px 16px',
    fontSize: '15px',
    border: `1px solid ${colors.neutral[300]}`,
    borderRadius: '8px',
    backgroundColor: colors.white,
    color: colors.neutral[700],
    transition: 'all 0.2s ease',
    boxSizing: 'border-box',
    fontFamily: 'inherit',
  },
  button: {
    width: '100%',
    padding: '14px 24px',
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
    marginTop: '8px',
  },
  buttonDisabled: {
    opacity: 0.5,
    cursor: 'not-allowed',
  },
  message: {
    marginTop: '16px',
    padding: '12px 16px',
    borderRadius: '8px',
    fontSize: '14px',
    fontWeight: '500',
    textAlign: 'center',
  },
  messageError: {
    backgroundColor: '#FEF2F2',
    color: colors.error,
    border: `1px solid ${colors.error}40`,
  },
  demoInfo: {
    marginTop: '24px',
    padding: '16px',
    backgroundColor: colors.neutral[50],
    borderRadius: '8px',
    border: `1px solid ${colors.neutral[200]}`,
  },
  demoInfoTitle: {
    fontSize: '13px',
    fontWeight: '600',
    color: colors.neutral[600],
    marginBottom: '8px',
    textTransform: 'uppercase',
    letterSpacing: '0.05em',
  },
  demoInfoText: {
    fontSize: '14px',
    color: colors.neutral[600],
    lineHeight: '1.6',
  },
  links: {
    marginTop: '24px',
    textAlign: 'center',
    fontSize: '14px',
    color: colors.neutral[500],
  },
  link: {
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
    marginLeft: '4px',
  },
  forgotLink: {
    display: 'block',
    textAlign: 'right',
    fontSize: '13px',
    color: colors.primary,
    textDecoration: 'none',
    fontWeight: '500',
    marginBottom: '24px'
  }
};

// Login page component
function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login, isAuthenticated } = useAuth();
  const navigate = useNavigate();

  // Redirect if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    // Simple validation
    if (!username || !password) {
      setError('Please enter both username and password');
      setLoading(false);
      return;
    }

    try {
      // Attempt login with backend
      await login(username, password);
      // Redirect to dashboard on success
      navigate('/');
    } catch (error) {
      // Handle login error
      const errorMessage = error.response?.data?.error || 'Invalid username or password. Please try again.';
      setError(errorMessage);
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
        .login-button:hover:not(:disabled) {
          background-color: ${colors.primaryHover};
        }
      `}</style>
      <div style={styles.container}>
        <div style={styles.loginCard}>
          <div style={styles.logo}>
            <div style={styles.logoText}>Inventory System</div>
            <div style={styles.logoSubtext}>Sign in to your account</div>
          </div>

          <h2 style={styles.title}>Welcome back</h2>
          <p style={styles.subtitle}>Enter your credentials to access your inventory</p>

          <form onSubmit={handleSubmit}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                style={styles.input}
                placeholder="Enter your username"
                autoComplete="username"
                required
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>Password</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                style={styles.input}
                placeholder="Enter your password"
                autoComplete="current-password"
                required
              />
            </div>

            <Link to="/forgot-password" style={styles.forgotLink}>Forgot password?</Link>

            <button
              type="submit"
              disabled={loading}
              style={{
                ...styles.button,
                ...(loading && styles.buttonDisabled)
              }}
              className="login-button"
            >
              {loading ? 'Signing in...' : 'Sign in'}
            </button>
          </form>

          {error && (
            <div style={{ ...styles.message, ...styles.messageError }}>
              {error}
            </div>
          )}

          <div style={styles.links}>
            New to our platform?
            <Link to="/signup" style={styles.link}>Create an account</Link>
          </div>

        </div>
      </div>
    </>
  );
}

export default Login;

