import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { UserContext } from "../context/UserContext";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useContext(UserContext);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    try {
      const res = await axios.post("http://localhost:8080/api/users/login", { email, password });
      login(res.data);
      navigate("/");
    } catch (err) {
      alert("Invalid credentials");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div style={styles.wrapper}>
      {/* Background decorative elements */}
      <div style={styles.blob1}></div>
      <div style={styles.blob2}></div>

      <div style={styles.card}>
        <div style={styles.header}>
          <h2 style={styles.title}>Welcome Back</h2>
          <p style={styles.subtitle}>Enter your details to continue your journey</p>
        </div>
        
        <form onSubmit={handleLogin} style={styles.form}>
          <div style={styles.inputWrapper}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              placeholder="name@gmail.com" 
              style={styles.input}
              onChange={(e) => setEmail(e.target.value)} 
              required 
            />
          </div>

          <div style={styles.inputWrapper}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              placeholder="••••••••" 
              style={styles.input}
              onChange={(e) => setPassword(e.target.value)} 
              required 
            />
          </div>

          <button 
            type="submit" 
            style={isLoading ? {...styles.button, ...styles.buttonDisabled} : styles.button}
            disabled={isLoading}
          >
            {isLoading ? "Signing in..." : "Login"}
          </button>
        </form>
        
        <p style={styles.footer}>
          New here?{" "}
          <span 
            style={styles.link} 
            onClick={() => navigate("/register")}
          >
            Create an account
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
    backgroundColor: '#0f172a', // Deep midnight blue
    overflow: 'hidden',
    position: 'relative',
    fontFamily: '"Inter", sans-serif',
  },
  // Decorative blurred shapes for depth
  blob1: {
    position: 'absolute',
    width: '400px',
    height: '400px',
    background: 'rgba(37, 99, 235, 0.2)',
    filter: 'blur(80px)',
    borderRadius: '50%',
    top: '-10%',
    right: '10%',
    zIndex: 0,
  },
  blob2: {
    position: 'absolute',
    width: '300px',
    height: '300px',
    background: 'rgba(168, 85, 247, 0.15)',
    filter: 'blur(80px)',
    borderRadius: '50%',
    bottom: '10%',
    left: '5%',
    zIndex: 0,
  },
  card: {
    width: '100%',
    maxWidth: '420px',
    padding: '48px',
    borderRadius: '24px',
    backgroundColor: 'rgba(255, 255, 255, 0.03)', // Translucent
    backdropFilter: 'blur(12px)', // Frosted glass
    border: '1px solid rgba(255, 255, 255, 0.1)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    zIndex: 1,
    textAlign: 'left',
  },
  header: {
    marginBottom: '32px',
    textAlign: 'center',
  },
  title: {
    fontSize: '32px',
    fontWeight: '800',
    color: '#f8fafc',
    margin: '0 0 8px 0',
    letterSpacing: '-0.025em',
  },
  subtitle: {
    color: '#94a3b8',
    fontSize: '15px',
    lineHeight: '1.5',
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    gap: '20px',
  },
  inputWrapper: {
    display: 'flex',
    flexDirection: 'column',
    gap: '8px',
  },
  label: {
    fontSize: '13px',
    fontWeight: '600',
    color: '#cbd5e1',
    marginLeft: '4px',
  },
  input: {
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    backgroundColor: 'rgba(255, 255, 255, 0.05)',
    color: '#fff',
    fontSize: '15px',
    outline: 'none',
    transition: 'all 0.2s ease-in-out',
    boxSizing: 'border-box',
    // On focus, it should glow (add via CSS class ideally, or handle via JS state)
  },
  button: {
    marginTop: '10px',
    padding: '14px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #2563eb 0%, #3b82f6 100%)',
    color: '#fff',
    fontSize: '16px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'transform 0.2s, box-shadow 0.2s',
    boxShadow: '0 4px 15px rgba(37, 99, 235, 0.3)',
  },
  buttonDisabled: {
    opacity: 0.6,
    cursor: 'not-allowed',
  },
  footer: {
    marginTop: '24px',
    fontSize: '14px',
    color: '#94a3b8',
    textAlign: 'center',
  },
  link: {
    color: '#60a5fa',
    cursor: 'pointer',
    fontWeight: '600',
    textDecoration: 'none',
    transition: 'color 0.2s',
  },
};