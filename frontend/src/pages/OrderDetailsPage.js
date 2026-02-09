import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { api } from "../services/Api";

export default function OrderDetailsPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [order, setOrder] = useState(null);

  useEffect(() => {
    api.get(`/orders/${id}`).then(res => {
      setOrder(res.data);
    });
  }, [id]);

  if (!order) return (
    <div style={styles.loaderWrap}>
      <div className="spinner"></div>
      <p>Syncing secure order details...</p>
    </div>
  );

  return (
    <div style={styles.pageWrapper}>
      <style>{`
        @keyframes slideIn {
          from { opacity: 0; transform: translateY(15px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .item-row { animation: slideIn 0.4s ease forwards; }
      `}</style>

      <div style={styles.ambientGlow}></div>

      <div style={styles.container}>
        <div style={styles.header}>
            <button style={styles.backBtn} onClick={() => navigate(-1)}>
              <span style={{fontSize: '18px'}}>←</span> Back
            </button>
            <div style={styles.statusBadge(order.status)}>{order.status}</div>
        </div>
        
        <div style={styles.titleSection}>
          <div style={styles.receiptIcon}>🧾</div>
          <h2 style={styles.title}>Invoice</h2>
          <p style={styles.orderId}>TRANSACTION ID: {order.id}</p>
        </div>

        <div style={styles.metaRow}>
          <div style={styles.metaItem}>
            <span style={styles.label}>Payment Method</span>
            <span style={styles.value}>{order.paymentMethod || 'Credit Card'}</span>
          </div>
          <div style={{...styles.metaItem, textAlign: 'right'}}>
            <span style={styles.label}>Transaction Date</span>
            <span style={styles.value}>{new Date().toLocaleDateString()}</span>
          </div>
        </div>

        <div style={styles.itemsList}>
          <h3 style={styles.sectionTitle}>Manifest</h3>
          {order.items.map((item, i) => (
            <div 
              key={item.id} 
              className="item-row"
              style={{...styles.itemRow, animationDelay: `${i * 0.1}s`}}
            >
              <div style={styles.itemMain}>
                <span style={styles.itemName}>{item.productName}</span>
                <span style={styles.itemQty}>Unit Quantity: {item.quantity}</span>
              </div>
              <div style={styles.itemPrice}>Rs {(item.price * item.quantity).toLocaleString()}</div>
            </div>
          ))}
        </div>

        <div style={styles.footer}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Grand Total</span>
            <span style={styles.totalValue}>Rs {order.total.toLocaleString()}</span>
          </div>
          <button 
            style={styles.doneBtn} 
            onClick={() => navigate("/")}
            onMouseEnter={(e) => e.target.style.transform = 'scale(1.02)'}
            onMouseLeave={(e) => e.target.style.transform = 'scale(1)'}
          >
            Confirm & Finish
          </button>
          <p style={styles.supportText}>Digital Receipt — Keep for your records</p>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { 
    minHeight: '100vh', 
    background: '#0f172a', 
    padding: '100px 20px 60px',
    position: 'relative',
    overflow: 'hidden'
  },
  ambientGlow: {
    position: 'absolute', top: '0', left: '30%', width: '40vw', height: '40vh',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
    zIndex: 0
  },
  loaderWrap: { 
    height: '100vh', display: 'flex', flexDirection: 'column', 
    justifyContent: 'center', alignItems: 'center', background: '#0f172a', color: '#64748b' 
  },
  container: { 
    maxWidth: '500px', margin: '0 auto', 
    background: 'rgba(30, 41, 59, 0.6)', 
    backdropFilter: 'blur(20px)',
    borderRadius: '32px', 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    position: 'relative', zIndex: 1
  },
  header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '30px 30px 0' },
  backBtn: { 
    background: 'none', border: 'none', color: '#94a3b8', 
    cursor: 'pointer', fontWeight: '700', fontSize: '14px',
    display: 'flex', alignItems: 'center', gap: '8px'
  },
  statusBadge: (status) => ({
    background: status?.toLowerCase() === 'completed' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
    color: status?.toLowerCase() === 'completed' ? '#10b981' : '#3b82f6',
    padding: '6px 14px', borderRadius: '12px', fontSize: '11px', fontWeight: '800', 
    textTransform: 'uppercase', letterSpacing: '0.5px', border: '1px solid rgba(255,255,255,0.05)'
  }),
  titleSection: { textAlign: 'center', padding: '20px 0 35px', borderBottom: '1px dashed rgba(255,255,255,0.1)' },
  receiptIcon: { fontSize: '40px', marginBottom: '10px' },
  title: { margin: 0, fontWeight: 800, fontSize: '28px', color: '#fff', letterSpacing: '-1px' },
  orderId: { color: '#64748b', margin: '8px 0 0', fontSize: '11px', fontWeight: '700', letterSpacing: '1px' },
  metaRow: { display: 'flex', justifyContent: 'space-between', padding: '25px 30px', borderBottom: '1px solid rgba(255,255,255,0.05)' },
  label: { fontSize: '10px', textTransform: 'uppercase', color: '#475569', fontWeight: 800, display: 'block', marginBottom: '4px' },
  value: { fontSize: '14px', fontWeight: 600, color: '#f1f5f9' },
  itemsList: { padding: '30px' },
  sectionTitle: { fontSize: '11px', fontWeight: '800', color: '#475569', textTransform: 'uppercase', marginBottom: '20px', letterSpacing: '1.5px' },
  itemRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', opacity: 0 },
  itemMain: { display: 'flex', flexDirection: 'column' },
  itemName: { fontWeight: '600', fontSize: '15px', color: '#f8fafc' },
  itemQty: { fontSize: '12px', color: '#64748b', marginTop: '4px' },
  itemPrice: { fontWeight: '700', fontSize: '15px', color: '#fff' },
  footer: { padding: '30px', background: 'rgba(255,255,255,0.02)', textAlign: 'center' },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '25px' },
  totalLabel: { fontSize: '18px', fontWeight: '600', color: '#94a3b8' },
  totalValue: { fontSize: '24px', fontWeight: '900', color: '#fff' },
  doneBtn: { 
    width: '100%', padding: '16px', 
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
    color: '#fff', border: 'none', borderRadius: '16px', 
    fontWeight: '800', fontSize: '16px', cursor: 'pointer',
    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
    transition: 'transform 0.2s ease'
  },
  supportText: { fontSize: '11px', color: '#475569', marginTop: '20px', fontWeight: '600' }
};