import { useContext, useState } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function CartPage() {
  const { cartItems, increase, decrease, removeItem } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();
  const [hoveredId, setHoveredId] = useState(null);

  const total = cartItems.reduce((sum, item) => sum + (Number(item.price) || 0) * item.quantity, 0);

  if (cartItems.length === 0) {
    return (
      <div style={styles.emptyWrap}>
        <div style={styles.ambientGlow}></div>
        <div style={styles.emptyIcon}>🛍️</div>
        <h2 style={styles.emptyTitle}>Your bag is empty</h2>
        <p style={styles.emptySub}>Looks like you haven't added any AI-curated deals yet.</p>
        <button style={styles.shopBtn} onClick={() => navigate("/")}>Explore Marketplace</button>
      </div>
    );
  }

  return (
    <div style={styles.container}>
      {/* Background Glow */}
      <div style={styles.ambientGlow}></div>

      <div style={styles.contentWrapper}>
        <div style={styles.cartList}>
          <div style={styles.headerRow}>
            <h1 style={styles.heading}>Cart</h1>
            <span style={styles.itemCount}>{cartItems.length} product in cart</span>
          </div>

          {cartItems.map(item => (
            <div 
              key={item.id} 
              style={{
                ...styles.cartItem,
                background: hoveredId === item.id ? 'rgba(255, 255, 255, 0.03)' : 'transparent',
                transform: hoveredId === item.id ? 'translateX(10px)' : 'translateX(0)'
              }}
              onMouseEnter={() => setHoveredId(item.id)}
              onMouseLeave={() => setHoveredId(null)}
            >
              <div style={styles.itemInfo}>
                <h3 style={styles.itemName}>{item.name}</h3>
                <p style={styles.itemCategory}>{item.category || "Premium Tier"}</p>
                <p style={styles.itemPrice}>Rs {Number(item.price).toLocaleString()}</p>
                <button style={styles.removeBtn} onClick={() => removeItem(item.id)}>Remove item</button>
              </div>

              <div style={styles.qtyControls}>
                <button style={styles.qtyBtn} onClick={() => decrease(item.id)}>−</button>
                <span style={styles.qtyVal}>{item.quantity}</span>
                <button style={styles.qtyBtn} onClick={() => increase(item.id)}>+</button>
              </div>
            </div>
          ))}
        </div>

        {/* SUMMARY SECTION */}
        <aside style={styles.summaryCard}>
          <h2 style={styles.subHeading}>Summary</h2>
          
          <div style={styles.summaryRow}>
            <span>Subtotal</span>
            <span style={styles.whiteText}>Rs {total.toLocaleString()}</span>
          </div>
          
          <div style={styles.summaryRow}>
            <span>Logistics</span>
            <span style={{color: '#10b981', fontWeight: 700}}>Free</span>
          </div>
          
          <div style={styles.hr}></div>
          
          <div style={{...styles.summaryRow, fontWeight: 800, fontSize: 18, color: '#fff'}}>
            <span>Total</span>
            <span>Rs {total.toLocaleString()}</span>
          </div>

          <button 
            style={styles.checkoutBtn} 
            onClick={() => user ? navigate("/payment") : navigate("/login")}
          >
            {user ? "Proceed to Checkout →" : "Sign In to Checkout"}
          </button>

          <p style={styles.securityNote}>🔒 Secure Encrypted Transaction</p>
        </aside>
      </div>
    </div>
  );
}

/* ---------------- MODERN STYLES ---------------- */

const styles = {
  container: { 
    padding: '120px 6% 60px', 
    background: '#0f172a', 
    minHeight: '100vh', 
    position: 'relative', 
    overflow: 'hidden',
    fontFamily: '"Inter", sans-serif'
  },
  ambientGlow: {
    position: 'absolute', top: '10%', right: '-5%', width: '40vw', height: '40vh',
    background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)',
    zIndex: 0, pointerEvents: 'none'
  },
  contentWrapper: { display: 'flex', gap: 60, maxWidth: '1400px', margin: '0 auto', position: 'relative', zIndex: 1, flexWrap: 'wrap' },
  cartList: { flex: 2, minWidth: 350 },
  headerRow: { display: 'flex', alignItems: 'baseline', gap: 20, marginBottom: 40, borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: 20 },
  heading: { fontSize: 36, fontWeight: 800, margin: 0, color: '#fff', letterSpacing: '-1px' },
  itemCount: { color: '#64748b', fontSize: 15, fontWeight: 500 },
  
  cartItem: { 
    display: 'flex', justifyContent: 'space-between', alignItems: 'center', 
    padding: '30px 20px', borderBottom: '1px solid rgba(255,255,255,0.05)',
    borderRadius: '16px', transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)'
  },
  itemName: { fontSize: 20, fontWeight: 700, color: '#f8fafc', margin: 0 },
  itemCategory: { fontSize: 12, color: '#3b82f6', textTransform: 'uppercase', fontWeight: 800, letterSpacing: '1px', margin: '4px 0 12px' },
  itemPrice: { color: '#fff', fontWeight: 600, fontSize: 16, margin: 0 },
  removeBtn: { background: 'none', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '10px 0 0', fontSize: 12, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.5px' },

  qtyControls: { display: 'flex', alignItems: 'center', gap: 20, background: 'rgba(255,255,255,0.03)', padding: '8px 16px', borderRadius: '12px', border: '1px solid rgba(255,255,255,0.05)' },
  qtyBtn: { width: 32, height: 32, borderRadius: '8px', border: '1px solid rgba(255,255,255,0.1)', background: 'transparent', color: '#fff', cursor: 'pointer', fontSize: 18, transition: '0.2s' },
  qtyVal: { fontWeight: 800, color: '#fff', fontSize: 16, minWidth: '20px', textAlign: 'center' },
  
  summaryCard: { 
    flex: 1, minWidth: 320, background: 'rgba(30, 41, 59, 0.5)', 
    backdropFilter: 'blur(20px)', padding: 40, borderRadius: 32, 
    height: 'fit-content', border: '1px solid rgba(255,255,255,0.08)',
    position: 'sticky', top: 120
  },
  subHeading: { fontSize: 22, fontWeight: 800, color: '#fff', marginBottom: 24 },
  summaryRow: { display: 'flex', justifyContent: 'space-between', marginBottom: 18, color: '#94a3b8', fontSize: 15 },
  whiteText: { color: '#fff', fontWeight: 600 },
  hr: { height: '1px', background: 'rgba(255,255,255,0.05)', margin: '24px 0' },
  checkoutBtn: { 
    width: '100%', padding: '18px 0', 
    background: 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)', 
    color: '#fff', border: 'none', borderRadius: 16, 
    fontWeight: 800, fontSize: 16, cursor: 'pointer', marginTop: 10,
    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)', transition: 'transform 0.2s'
  },
  securityNote: { textAlign: 'center', fontSize: 11, color: '#475569', marginTop: 20, fontWeight: 600 },

  emptyWrap: { textAlign: 'center', padding: '150px 20px', background: '#0f172a', minHeight: '100vh', color: '#fff' },
  emptyIcon: { fontSize: 64, marginBottom: 24, opacity: 0.3 },
  emptyTitle: { fontSize: 32, fontWeight: 800, margin: '0 0 12px' },
  emptySub: { color: '#64748b', marginBottom: 32 },
  shopBtn: { padding: '14px 32px', background: '#3b82f6', color: '#fff', borderRadius: 14, border: 'none', fontWeight: 700, cursor: 'pointer' }
};