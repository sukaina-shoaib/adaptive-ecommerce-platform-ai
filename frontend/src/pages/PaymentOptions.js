import { useState, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { api } from "../services/Api";

function PaymentOptions() {
  const [method, setMethod] = useState("");
  const { cartItems, clearCart } = useContext(CartContext);
  const { user } = useContext(UserContext);
  const navigate = useNavigate();

  const total = cartItems.reduce(
    (sum, item) => sum + Number(item.price) * Number(item.quantity),
    0
  );

  const handlePay = async () => {
    if (!method) return; 
    if (!user) return navigate("/login");

    const payload = {
      userId: Number(user.id),
      paymentMethod: method,
      total: Number(total.toFixed(2)),
      items: cartItems.map(item => ({
        id: Number(item.id),
        name: item.name,
        quantity: Number(item.quantity),
        price: Number(item.price)
      }))
    };

    try {
      const res = await api.post("/orders", payload);
      const orderId = res.data.id; 

      const orderSummary = {
        items: cartItems,
        total,
        method: method,
        orderId: orderId 
      };

      clearCart();
      navigate("/order-success", { state: orderSummary });

    } catch (err) {
      console.error("Checkout Error:", err);
      alert("Order failed. Stock might be insufficient or server is down.");
    }
  };

  return (
    <div style={styles.pageWrapper}>
      <div style={styles.ambientGlow}></div>
      
      <div style={styles.container}>
        <div style={styles.lockIcon}>🛡️</div>
        <h2 style={styles.title}>Secure Checkout</h2>
        <p style={styles.subtitle}>Select your preferred settlement method</p>

        <div style={styles.methodList}>
          {/* CARD OPTION */}
          <div 
            style={{
              ...styles.methodCard,
              borderColor: method === "CARD" ? "#3b82f6" : "rgba(255,255,255,0.05)",
              background: method === "CARD" ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)",
              transform: method === "CARD" ? "scale(1.02)" : "scale(1)"
            }}
            onClick={() => setMethod("CARD")}
          >
            <div style={styles.iconBox}>💳</div>
            <div style={styles.methodInfo}>
              <span style={styles.methodTitle}>Digital Card</span>
              <span style={styles.methodDesc}>Visa, Mastercard, AMEX</span>
            </div>
            <div style={styles.radioContainer}>
                <div style={styles.radioOuter}>
                    {method === "CARD" && <div style={styles.radioInner} />}
                </div>
            </div>
          </div>

          {/* COD OPTION */}
          <div 
            style={{
              ...styles.methodCard,
              borderColor: method === "COD" ? "#3b82f6" : "rgba(255,255,255,0.05)",
              background: method === "COD" ? "rgba(59, 130, 246, 0.1)" : "rgba(255,255,255,0.02)",
              transform: method === "COD" ? "scale(1.02)" : "scale(1)"
            }}
            onClick={() => setMethod("COD")}
          >
            <div style={styles.iconBox}>🚚</div>
            <div style={styles.methodInfo}>
              <span style={styles.methodTitle}>Cash on Delivery</span>
              <span style={styles.methodDesc}>Settle balance upon arrival</span>
            </div>
            <div style={styles.radioContainer}>
                <div style={styles.radioOuter}>
                    {method === "COD" && <div style={styles.radioInner} />}
                </div>
            </div>
          </div>
        </div>

        <div style={styles.summaryBox}>
          <div style={styles.totalRow}>
            <span style={styles.totalLabel}>Grand Total</span>
            <span style={styles.totalValue}>Rs {total.toLocaleString()}</span>
          </div>
        </div>

        <button 
          onClick={handlePay} 
          style={{
            ...styles.payBtn,
            background: method ? 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)' : 'rgba(255,255,255,0.05)',
            color: method ? '#fff' : '#475569',
            cursor: method ? 'pointer' : 'not-allowed',
            boxShadow: method ? '0 10px 25px -5px rgba(37, 99, 235, 0.4)' : 'none'
          }}
          disabled={!method}
        >
          {method ? "Finalize Transaction" : "Select Payment Method"}
        </button>

        <div style={styles.securityFooter}>
            <span style={styles.secureBadge}>✓ SSL Encrypted</span>
            <span style={styles.secureBadge}>✓ Verified Merchant</span>
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: { 
    minHeight: '100vh', 
    background: '#0f172a', 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center',
    padding: '100px 20px 60px',
    position: 'relative',
    overflow: 'hidden'
  },
  ambientGlow: {
    position: 'absolute', top: '20%', left: '50%', transform: 'translate(-50%, -50%)',
    width: '60vw', height: '60vh',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.05) 0%, transparent 70%)',
    zIndex: 0
  },
  container: { 
    width: '100%', 
    maxWidth: '460px', 
    background: 'rgba(30, 41, 59, 0.6)', 
    backdropFilter: 'blur(20px)',
    borderRadius: '32px', 
    padding: '40px', 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)',
    height: 'fit-content',
    position: 'relative',
    zIndex: 1,
    textAlign: 'center'
  },
  lockIcon: { fontSize: '40px', marginBottom: '16px' },
  title: { fontSize: '28px', fontWeight: '800', margin: '0 0 8px 0', color: '#fff', letterSpacing: '-0.5px' },
  subtitle: { color: '#64748b', marginBottom: '36px', fontSize: '15px', fontWeight: '500' },
  
  methodList: { display: 'flex', flexDirection: 'column', gap: '14px', marginBottom: '32px' },
  methodCard: { 
    display: 'flex', alignItems: 'center', padding: '20px', 
    border: '1px solid', borderRadius: '18px', cursor: 'pointer', 
    transition: 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)', 
    justifyContent: 'space-between', textAlign: 'left'
  },
  iconBox: { 
    fontSize: '22px', marginRight: '16px', 
    background: 'rgba(255,255,255,0.03)', width: '52px', height: '52px', 
    display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '14px',
    border: '1px solid rgba(255,255,255,0.05)'
  },
  methodInfo: { display: 'flex', flexDirection: 'column', flex: 1 },
  methodTitle: { fontWeight: '700', fontSize: '16px', color: '#f8fafc' },
  methodDesc: { fontSize: '12px', color: '#64748b', marginTop: '2px' },
  
  radioOuter: { 
    width: '20px', height: '20px', borderRadius: '50%', 
    border: '2px solid rgba(255,255,255,0.1)', display: 'flex', 
    alignItems: 'center', justifyContent: 'center' 
  },
  radioInner: { width: '10px', height: '10px', borderRadius: '50%', background: '#3b82f6' },

  summaryBox: { 
    background: 'rgba(255,255,255,0.02)', padding: '24px', 
    borderRadius: '20px', marginBottom: '32px', border: '1px solid rgba(255,255,255,0.05)' 
  },
  totalRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center' },
  totalLabel: { color: '#94a3b8', fontSize: '14px', fontWeight: '600' },
  totalValue: { color: '#fff', fontWeight: '900', fontSize: '22px' },

  payBtn: { 
    width: '100%', padding: '20px', border: 'none', 
    borderRadius: '18px', fontSize: '16px', fontWeight: '800', 
    transition: 'all 0.3s ease', letterSpacing: '0.5px' 
  },
  securityFooter: { 
    display: 'flex', justifyContent: 'center', gap: '20px', marginTop: '24px' 
  },
  secureBadge: { fontSize: '11px', color: '#475569', fontWeight: '700', textTransform: 'uppercase', letterSpacing: '0.5px' }
};

export default PaymentOptions;