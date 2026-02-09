import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export default function RegisterPage() {
  const [user, setUser] = useState({ name: "", email: "", password: "" });
  const [isLoading, setIsLoading] = useState(false);
  const [focusedField, setFocusedField] = useState(null); // Track focus for glow effects
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      await axios.post("http://localhost:8080/api/users/register", user);
      alert("Account created successfully!");
      navigate("/login");
    } catch (err) {
      alert("Registration failed. Email might already exist.");
    } finally {
      setIsLoading(false);
    }
  };

  const getInputStyle = (fieldName) => ({
    ...styles.input,
    borderColor: focusedField === fieldName ? '#3b82f6' : 'rgba(255, 255, 255, 0.1)',
    backgroundColor: focusedField === fieldName ? 'rgba(255, 255, 255, 0.08)' : 'rgba(255, 255, 255, 0.05)',
    boxShadow: focusedField === fieldName ? '0 0 0 4px rgba(59, 130, 246, 0.15)' : 'none',
  });

  return (
    <div style={styles.wrapper}>
      {/* Dynamic Background Blobs */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <div style={styles.logoIcon}>✨</div>
          <h2 style={styles.title}>Create Account</h2>
          <p style={styles.subtitle}>Join our adaptive marketplace today</p>
        </div>
        
        <form onSubmit={handleRegister} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Full Name</label>
            <input 
              type="text" 
              placeholder="Your Name" 
              style={getInputStyle('name')}
              onFocus={() => setFocusedField('name')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setUser({...user, name: e.target.value})} 
              required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@gmail.com" 
              style={getInputStyle('email')}
              onFocus={() => setFocusedField('email')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setUser({...user, email: e.target.value})} 
              required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={getInputStyle('password')}
              onFocus={() => setFocusedField('password')}
              onBlur={() => setFocusedField(null)}
              onChange={(e) => setUser({...user, password: e.target.value})} 
              required 
            />
          </div>

          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            onMouseEnter={(e) => !isLoading && (e.target.style.transform = 'translateY(-2px)')}
            onMouseLeave={(e) => !isLoading && (e.target.style.transform = 'translateY(0)')}
            disabled={isLoading}
          >
            {isLoading ? "Processing..." : "Get Started"}
          </button>
        </form>
        
        <p style={styles.footer}>
          Already a member?{" "}
          <span style={styles.link} onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
}

const styles = {
  wrapper: { 
    height: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    backgroundColor: '#0f172a', 
    overflow: 'hidden', 
    position: 'relative', 
    fontFamily: '"Inter", sans-serif' 
  },
  blob1: { 
    position: 'absolute', 
    width: '500px', 
    height: '500px', 
    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.2) 0%, rgba(37, 99, 235, 0) 70%)', 
    filter: 'blur(60px)', 
    top: '-10%', 
    right: '-5%', 
    zIndex: 0 
  },
  blob2: { 
    position: 'absolute', 
    width: '400px', 
    height: '400px', 
    background: 'radial-gradient(circle, rgba(168, 85, 247, 0.15) 0%, rgba(168, 85, 247, 0) 70%)', 
    filter: 'blur(60px)', 
    bottom: '5%', 
    left: '-5%', 
    zIndex: 0 
  },
  card: { 
    width: '100%', 
    maxWidth: '440px', 
    padding: '40px', 
    borderRadius: '28px', 
    backgroundColor: 'rgba(30, 41, 59, 0.7)', 
    backdropFilter: 'blur(16px)', 
    border: '1px solid rgba(255, 255, 255, 0.08)', 
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', 
    zIndex: 1 
  },
  header: { textAlign: 'center', marginBottom: '32px' },
  logoIcon: { fontSize: '40px', marginBottom: '10px' },
  title: { 
    fontSize: '30px', 
    fontWeight: '800', 
    color: '#f8fafc', 
    margin: '0', 
    letterSpacing: '-0.025em' 
  },
  subtitle: { color: '#94a3b8', fontSize: '15px', marginTop: '8px' },
  form: { display: 'flex', flexDirection: 'column', gap: '22px' },
  inputWrapper: { display: 'flex', flexDirection: 'column', gap: '8px' },
  label: { fontSize: '13px', fontWeight: '600', color: '#94a3b8', marginLeft: '4px' },
  input: { 
    padding: '14px 16px', 
    borderRadius: '12px', 
    border: '1px solid', 
    color: '#fff', 
    fontSize: '15px', 
    outline: 'none', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    boxSizing: 'border-box' 
  },
  button: { 
    marginTop: '10px', 
    padding: '16px', 
    borderRadius: '14px', 
    border: 'none', 
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
    color: '#fff', 
    fontSize: '16px', 
    fontWeight: '700', 
    cursor: 'pointer', 
    transition: 'all 0.3s ease', 
    boxShadow: '0 10px 15px -3px rgba(37, 99, 235, 0.3)' 
  },
  buttonDisabled: { opacity: 0.5, cursor: 'not-allowed', transform: 'none' },
  footer: { marginTop: '24px', fontSize: '14px', color: '#64748b', textAlign: 'center' },
  link: { 
    color: '#3b82f6', 
    cursor: 'pointer', 
    fontWeight: '600', 
    transition: 'color 0.2s ease' 
  },
};