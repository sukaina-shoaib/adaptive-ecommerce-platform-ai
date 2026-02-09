import { useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";

/**
 * OrderPage (Digital Receipt)
 * Features: Midnight Glass aesthetic, thermal-receipt dashed styling, and staggered item reveal.
 */
export default function OrderPage() {
  const { state } = useLocation();
  const navigate = useNavigate();
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    if (!state) {
      navigate("/");
    } else {
      setIsVisible(true);
    }
  }, [state, navigate]);

  if (!state) return null;
  const { items, total, method, orderId } = state;

  return (
    <div style={styles.page}>
      <style>{`
        @keyframes reveal {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .receipt-item { animation: reveal 0.4s ease forwards; }
      `}</style>

      {/* Background Ambient Glow */}
      <div style={styles.ambientGlow}></div>

      <div style={{
        ...styles.ticket,
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? 'scale(1)' : 'scale(0.95)'
      }}>
        {/* SUCCESS HEADER */}
        <div style={styles.successIcon}>✓</div>
        <h2 style={styles.title}>Payment Received</h2>
        <p style={styles.subtitle}>Order No: #{orderId || 'TXN-' + Math.floor(Math.random() * 10000)}</p>

        <div style={styles.detailsBox}>
          {/* META DATA */}
          <div style={styles.metaRow}>
            <div>
              <span style={styles.label}>Settlement</span>
              <span style={styles.value}>{method || 'CARD'}</span>
            </div>
            <div style={{ textAlign: 'right' }}>
              <span style={styles.label}>Timestamp</span>
              <span style={styles.value}>{new Date().toLocaleDateString()}</span>
            </div>
          </div>

          <div style={styles.dashedDivider} />

          {/* ITEM LIST */}
          <div style={styles.itemSection}>
            <span style={styles.label}>Product</span>
            {items.map((item, idx) => (
              <div 
                key={idx} 
                className="receipt-item"
                style={{...styles.itemRow, animationDelay: `${idx * 0.1}s`}}
              >
                <div style={styles.itemMain}>
                    <span style={styles.itemName}>{item.name}</span>
                    <span style={styles.itemQty}>Unit Quantity: {item.quantity}</span>
                </div>
                <span style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</span>
              </div>
            ))}
          </div>

          <div style={styles.dashedDivider} />

          {/* TOTAL */}
          <div style={styles.grandTotal}>
            <span style={styles.totalLabel}>Amount Paid</span>
            <span style={styles.totalValue}>Rs {total.toLocaleString()}</span>
          </div>
        </div>

        {/* ACTIONS */}
        <button style={styles.homeBtn} onClick={() => navigate("/")}>
          Return to Marketplace
        </button>
        <p style={styles.footerNote}>AdaptiveMart Intelligence Security Verified</p>
      </div>
    </div>
  );
}

const styles = {
  page: { 
    background: '#0f172a', 
    minHeight: '100vh', 
    display: 'flex', 
    alignItems: 'center', 
    justifyContent: 'center', 
    padding: '100px 20px 60px',
    position: 'relative',
    overflow: 'hidden'
  },
  ambientGlow: {
    position: 'absolute', top: '50%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '50vw', height: '50vh',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
    zIndex: 0
  },
  ticket: { 
    background: 'rgba(30, 41, 59, 0.6)', 
    backdropFilter: 'blur(20px)',
    width: '100%', 
    maxWidth: '460px', 
    borderRadius: '32px', 
    padding: '40px', 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    textAlign: 'center',
    position: 'relative',
    zIndex: 1,
    transition: 'all 0.6s cubic-bezier(0.16, 1, 0.3, 1)'
  },
  successIcon: { 
    width: '64px', height: '64px', 
    background: '#10b981', color: '#fff', 
    borderRadius: '50%', display: 'flex', 
    alignItems: 'center', justifyContent: 'center', 
    fontSize: '28px', margin: '0 auto 24px',
    boxShadow: '0 0 20px rgba(16, 185, 129, 0.4)' 
  },
  title: { fontSize: '26px', fontWeight: '800', color: '#fff', marginBottom: '8px', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', fontSize: '13px', marginBottom: '40px', fontWeight: '600' },
  
  detailsBox: { textAlign: 'left' },
  metaRow: { display: 'flex', justifyContent: 'space-between' },
  label: { fontSize: '10px', color: '#475569', textTransform: 'uppercase', fontWeight: '800', letterSpacing: '1px', marginBottom: '6px', display: 'block' },
  value: { fontSize: '14px', fontWeight: '700', color: '#f1f5f9' },
  
  dashedDivider: { height: '1px', borderTop: '2px dashed rgba(255,255,255,0.1)', margin: '24px 0' },
  
  itemSection: { marginBottom: '10px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px', opacity: 0 },
  itemMain: { display: 'flex', flexDirection: 'column' },
  itemName: { fontSize: '15px', color: '#f8fafc', fontWeight: '600' },
  itemQty: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  itemPrice: { fontWeight: '700', color: '#fff', fontSize: '15px' },
  
  grandTotal: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    marginTop: '10px', padding: '10px 0' 
  },
  totalLabel: { fontSize: '18px', fontWeight: '600', color: '#94a3b8' },
  totalValue: { fontSize: '24px', fontWeight: '900', color: '#fff' },
  
  homeBtn: { 
    width: '100%', marginTop: '40px', padding: '18px', 
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
    color: '#fff', border: 'none', borderRadius: '16px', 
    fontWeight: '800', fontSize: '15px', cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.3)',
    transition: 'transform 0.2s ease'
  },
  footerNote: { fontSize: '10px', color: '#475569', marginTop: '20px', fontWeight: '700', textTransform: 'uppercase' }
};