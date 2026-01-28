import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { signupUser } from '../api';

const colors = {
    primary: '#5C6AC4',
    primaryHover: '#4C5AB4',
    neutral: { 50: '#FAFBFC', 100: '#F4F6F8', 200: '#DFE3E8', 300: '#C4CDD5', 400: '#919EAB', 500: '#637381', 600: '#454F5B', 700: '#212B36' },
    success: '#47C1BF',
    error: '#BF0711',
    white: '#FFFFFF',
};

const styles = {
    container: { minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', backgroundColor: colors.neutral[50], padding: '20px' },
    card: { backgroundColor: colors.white, borderRadius: '16px', padding: '48px', width: '100%', maxWidth: '440px', boxShadow: '0 4px 16px rgba(0, 0, 0, 0.1)', border: `1px solid ${colors.neutral[200]}` },
    title: { fontSize: '24px', fontWeight: '600', color: colors.neutral[700], marginBottom: '8px' },
    subtitle: { fontSize: '15px', color: colors.neutral[500], marginBottom: '32px' },
    formGroup: { marginBottom: '24px' },
    label: { fontSize: '14px', fontWeight: '500', color: colors.neutral[700], marginBottom: '8px', display: 'block' },
    input: { width: '100%', padding: '14px 16px', fontSize: '15px', border: `1px solid ${colors.neutral[300]}`, borderRadius: '8px', backgroundColor: colors.white, color: colors.neutral[700], boxSizing: 'border-box' },
    button: { width: '100%', padding: '14px 24px', fontSize: '15px', fontWeight: '600', backgroundColor: colors.primary, color: colors.white, border: 'none', borderRadius: '8px', cursor: 'pointer', marginTop: '8px' },
    message: { marginTop: '16px', padding: '12px 16px', borderRadius: '8px', fontSize: '14px', textAlign: 'center' },
    messageError: { backgroundColor: '#FEF2F2', color: colors.error, border: `1px solid ${colors.error}40` },
    links: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: colors.neutral[500] },
    link: { color: colors.primary, textDecoration: 'none', fontWeight: '500', marginLeft: '4px' }
};

function Signup() {
    const [formData, setFormData] = useState({
        username: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            setError("Passwords don't match");
            return;
        }

        setError('');
        setLoading(true);

        try {
            await signupUser({
                username: formData.username,
                password: formData.password,
                email: formData.email
            });
            navigate('/login');
        } catch (err) {
            const data = err.response?.data?.errors;
            if (data) {
                // Flatten error object
                const msgs = Object.values(data).flat().map(String).join(' ');
                setError(msgs || 'Failed to create account.');
            } else {
                setError('Failed to create account. Please try again.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Create an account</h2>
                <p style={styles.subtitle}>Start managing your inventory today</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Username</label>
                        <input
                            name="username"
                            type="text"
                            required
                            style={styles.input}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email (Optional)</label>
                        <input
                            name="email"
                            type="email"
                            style={styles.input}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Password</label>
                        <input
                            name="password"
                            type="password"
                            required
                            style={styles.input}
                            onChange={handleChange}
                        />
                    </div>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Confirm Password</label>
                        <input
                            name="confirmPassword"
                            type="password"
                            required
                            style={styles.input}
                            onChange={handleChange}
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Creating Account...' : 'Sign Up'}
                    </button>
                </form>

                {error && <div style={{ ...styles.message, ...styles.messageError }}>{error}</div>}

                <div style={styles.links}>
                    Already have an account?
                    <Link to="/login" style={styles.link}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default Signup;
