import { useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";

/**
 * OrderSuccess Component
 * Modernized with Midnight Glass aesthetic and celebration animations.
 */
export default function OrderSuccess() {
  const navigate = useNavigate();
  const { state } = useLocation();
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    // Trigger entrance animation
    setIsLoaded(true);
  }, []);

  return (
    <div style={styles.page}>
      {/* Background Celebration Glow */}
      <div style={styles.ambientGlow}></div>

      <div style={{
        ...styles.card,
        opacity: isLoaded ? 1 : 0,
        transform: isLoaded ? 'scale(1) translateY(0)' : 'scale(0.9) translateY(20px)'
      }}>
        {/* SUCCESS ICON WITH PULSE */}
        <div style={styles.iconWrapper}>
          <div style={styles.pulseRing}></div>
          <div style={styles.iconCircle}>✓</div>
        </div>
        
        <h1 style={styles.title}>Payment Confirmed</h1>
        <p style={styles.subtitle}>
          Your transaction was successful. An AI-generated summary of your order has been sent to your inbox.
        </p>

        {/* ORDER INFO PREVIEW (GLASS INSET) */}
        <div style={styles.orderPreview}>
           <span style={styles.previewLabel}>Order No </span>
           <span style={styles.previewValue}>#{state?.orderId || 'INTERNAL-SYNC'}</span>
        </div>
        
        <div style={styles.actionArea}>
          <button 
            style={styles.primaryBtn} 
            onMouseEnter={(e) => e.target.style.transform = 'translateY(-2px)'}
            onMouseLeave={(e) => e.target.style.transform = 'translateY(0)'}
            onClick={() => navigate("/Orderpage", { state: state })}
          >
            Digital Receipt
          </button>

          <button 
            style={styles.secondaryBtn} 
            onMouseEnter={(e) => e.target.style.background = 'rgba(255,255,255,0.05)'}
            onMouseLeave={(e) => e.target.style.background = 'transparent'}
            onClick={() => navigate("/")}
          >
            Back to Marketplace
          </button>
        </div>

        <p style={styles.footerNote}>AdaptiveMart Intelligence: Shipping estimated in 2-4 days.</p>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    minHeight: "100vh", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    background: "#0f172a", // Deep Midnight
    fontFamily: "'Inter', sans-serif",
    position: 'relative',
    overflow: 'hidden',
    padding: '20px'
  },
  ambientGlow: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '60vw', height: '60vh',
    background: 'radial-gradient(circle, rgba(16, 185, 129, 0.08) 0%, transparent 70%)',
    zIndex: 0
  },
  card: { 
    maxWidth: 480, 
    width: "100%",
    padding: "60px 40px", 
    textAlign: "center", 
    background: "rgba(30, 41, 59, 0.6)", 
    backdropFilter: "blur(20px)",
    borderRadius: 40, 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)",
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.8s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  iconWrapper: {
    position: 'relative',
    width: 80,
    height: 80,
    margin: "0 auto 30px",
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },
  iconCircle: { 
    width: 80, 
    height: 80, 
    background: "#10b981", 
    color: "#fff", 
    borderRadius: "50%", 
    display: "flex", 
    alignItems: "center", 
    justifyContent: "center", 
    fontSize: 32,
    position: 'relative',
    zIndex: 2,
    boxShadow: "0 0 30px rgba(16, 185, 129, 0.4)" 
  },
  pulseRing: {
    position: 'absolute',
    width: '100%',
    height: '100%',
    borderRadius: '50%',
    border: '4px solid rgba(16, 185, 129, 0.2)',
    animation: 'pulse 2s infinite'
  },
  title: { 
    fontSize: "32px", 
    fontWeight: "800", 
    marginBottom: "16px",
    color: "#fff",
    letterSpacing: "-1px"
  },
  subtitle: { 
    color: "#94a3b8", 
    marginBottom: "40px", 
    lineHeight: "1.6",
    fontSize: "15px",
    padding: '0 10px'
  },
  orderPreview: {
    background: 'rgba(255, 255, 255, 0.03)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '35px',
    border: '1px solid rgba(255, 255, 255, 0.05)',
    display: 'flex',
    flexDirection: 'column',
    gap: '4px'
  },
  previewLabel: { fontSize: '11px', color: '#475569', fontWeight: '800', textTransform: 'uppercase' },
  previewValue: { fontSize: '15px', color: '#3b82f6', fontWeight: '700', letterSpacing: '0.5px' },

  actionArea: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "14px" 
  },
  primaryBtn: { 
    padding: "18px", 
    background: "linear-gradient(135deg, #10b981 0%, #059669 100%)", 
    color: "#fff", 
    borderRadius: "18px", 
    border: "none", 
    fontWeight: "800", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.3s ease",
    boxShadow: '0 10px 20px -5px rgba(16, 185, 129, 0.4)'
  },
  secondaryBtn: { 
    padding: "18px", 
    background: "transparent", 
    color: "#f1f5f9", 
    borderRadius: "18px", 
    border: "1px solid rgba(255, 255, 255, 0.1)", 
    fontWeight: "700", 
    fontSize: "16px",
    cursor: "pointer",
    transition: "all 0.2s ease"
  },
  footerNote: {
    marginTop: '30px',
    fontSize: '11px',
    color: '#475569',
    fontWeight: '600'
  }
};