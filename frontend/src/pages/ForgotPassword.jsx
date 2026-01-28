import { useState } from 'react';
import { Link } from 'react-router-dom';
import { requestPasswordReset } from '../api';

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
    messageSuccess: { backgroundColor: '#F0FDF4', color: '#15803D', border: '1px solid #BBF7D0' },
    messageError: { backgroundColor: '#FEF2F2', color: colors.error, border: `1px solid ${colors.error}40` },
    links: { marginTop: '24px', textAlign: 'center', fontSize: '14px', color: colors.neutral[500] },
    link: { color: colors.primary, textDecoration: 'none', fontWeight: '500', marginLeft: '4px' }
};

function ForgotPassword() {
    const [email, setEmail] = useState('');
    const [status, setStatus] = useState({ type: '', msg: '' });
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setStatus({ type: '', msg: '' });

        try {
            await requestPasswordReset(email);
            setStatus({ type: 'success', msg: 'If an account exists for ' + email + ', you will receive password reset instructions.' });
        } catch (err) {
            const errorObj = err.response?.data;
            const errorMsg = errorObj?.errors?.detail || errorObj?.message || errorObj?.detail || 'Failed to request password reset. Please try again.';
            setStatus({ type: 'error', msg: errorMsg });
            console.error('Password reset error:', errorObj);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={styles.container}>
            <div style={styles.card}>
                <h2 style={styles.title}>Reset Password</h2>
                <p style={styles.subtitle}>Enter your email to receive reset instructions</p>

                <form onSubmit={handleSubmit}>
                    <div style={styles.formGroup}>
                        <label style={styles.label}>Email Address</label>
                        <input
                            type="email"
                            required
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            style={styles.input}
                        />
                    </div>

                    <button type="submit" style={styles.button} disabled={loading}>
                        {loading ? 'Sending...' : 'Send Reset Link'}
                    </button>
                </form>

                {status.msg && (
                    <div style={{ ...styles.message, ...(status.type === 'success' ? styles.messageSuccess : styles.messageError) }}>
                        {status.msg}
                    </div>
                )}

                <div style={styles.links}>
                    Remember your password?
                    <Link to="/login" style={styles.link}>Sign in</Link>
                </div>
            </div>
        </div>
    );
}

export default ForgotPassword;
