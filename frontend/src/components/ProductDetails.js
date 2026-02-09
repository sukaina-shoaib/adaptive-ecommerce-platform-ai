import { useContext } from "react";
import { CartContext } from "../context/cartContext";
import { BACKEND_BASE_URL } from "../services/Config"; 

export default function ProductDetails({ product }) {
  const { addItem } = useContext(CartContext);
  if (!product) return null;

  const rawImg = product.image_url || product.imageUrl;
  const fullUrl = rawImg 
    ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_BASE_URL}/images/${rawImg}`)
    : "https://via.placeholder.com/400";

  const currentPrice = Number(product.currentPrice ?? product.price ?? 0);

  return (
    <div style={styles.card}>
      <div style={styles.imageWrapper}>
        <img src={fullUrl} alt={product.name} style={styles.image} />
        <div style={styles.imageOverlay} />
        
        {/* AI MATCH PROGRESS BAR - Redesigned as an integrated HUD */}
        {product.aiScore && (
          <div style={styles.aiMatchBox}>
             <div style={styles.aiHeader}>
                <span style={styles.aiTitle}>⚡ Neural Match Score</span>
                <span style={styles.aiPercent}>{Math.round(product.aiScore * 100)}%</span>
             </div>
             <div style={styles.progressBg}>
                <div style={{...styles.progressFill, width: `${product.aiScore * 100}%`}}></div>
             </div>
             <p style={styles.aiInsight}>Based on your recent navigation and purchase strategy.</p>
          </div>
        )}
      </div>

      <div style={styles.content}>
        <div style={styles.headerRow}>
          <h2 style={styles.title}>{product.name}</h2>
          <span style={styles.stockBadge(product.stock)}>
            {product.stock > 0 ? 'In Stock' : 'Out of Stock'}
          </span>
        </div>
        
        <p style={styles.desc}>{product.description}</p>

        <div style={styles.metaGrid}>
          <div style={styles.metaItem}>
              <span style={styles.label}>Collection</span>
              <span style={styles.value}>{product.category || 'General'}</span>
          </div>
          <div style={styles.metaItem}>
              <span style={styles.label}>Inventory</span>
              <span style={styles.value}>stock: {product.stock > 0 ? `${product.stock} ` : 'Waitlist'}</span>
          </div>
        </div>

        <div style={styles.footer}>
          <div style={styles.priceContainer}>
              <span style={styles.priceLabel}>Premium Price</span>
              <span style={styles.priceValue}>Rs {currentPrice.toLocaleString()}</span>
          </div>
          <button
            style={{
              ...styles.cartBtn, 
              opacity: product.stock === 0 ? 0.4 : 1,
              background: product.stock === 0 ? 'rgba(255,255,255,0.1)' : 'linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)'
            }}
            disabled={product.stock === 0}
            onClick={() => addItem(product)}
          >
            {product.stock > 0 ? 'Add To Cart' : 'Sold Out'}
          </button>
        </div>
      </div>
    </div>
  );
}

const styles = {
  card: { 
    background: "rgba(30, 41, 59, 0.5)", 
    backdropFilter: "blur(16px)", 
    borderRadius: 32, 
    padding: 0, 
    boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)", 
    border: '1px solid rgba(255, 255, 255, 0.08)', 
    display: "flex", 
    flexDirection: "column", 
    overflow: 'hidden' 
  },
  imageWrapper: { position: 'relative', padding: '16px' },
  image: { width: "100%", height: 280, objectFit: "cover", borderRadius: 24 },
  imageOverlay: {
    position: 'absolute', top: 16, left: 16, right: 16, bottom: 16,
    borderRadius: 24, background: 'linear-gradient(to bottom, transparent 50%, rgba(15, 23, 42, 0.4))'
  },
  
  aiMatchBox: { 
    marginTop: 15, 
    background: "rgba(15, 23, 42, 0.6)", 
    padding: "20px", 
    borderRadius: "20px", 
    border: "1px solid rgba(99, 102, 241, 0.2)" 
  },
  aiHeader: { display: "flex", justifyContent: "space-between", marginBottom: "10px" },
  aiTitle: { fontSize: "10px", fontWeight: "800", color: "#818cf8", textTransform: "uppercase", letterSpacing: '1px' },
  aiPercent: { fontSize: "16px", fontWeight: "900", color: "#fff" },
  aiInsight: { fontSize: '11px', color: '#64748b', marginTop: '10px', fontStyle: 'italic' },
  progressBg: { height: "6px", background: "rgba(255,255,255,0.05)", borderRadius: "10px", overflow: "hidden" },
  progressFill: { height: "100%", background: "linear-gradient(90deg, #3b82f6, #a855f7)", borderRadius: "10px" },

  content: { padding: '0 24px 24px' },
  headerRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 },
  title: { fontSize: 26, fontWeight: 800, color: "#fff", margin: 0, letterSpacing: '-0.5px' },
  stockBadge: (stock) => ({
    fontSize: '10px', 
    fontWeight: '800', 
    padding: '4px 10px', 
    borderRadius: '8px',
    textTransform: 'uppercase',
    background: stock > 0 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(239, 68, 68, 0.1)',
    color: stock > 0 ? '#10b981' : '#ef4444',
  }),
  desc: { fontSize: '14px', color: "#94a3b8", lineHeight: 1.7, marginBottom: 20 },
  metaGrid: { display: 'flex', gap: '40px', borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '24px' },
  metaItem: { display: 'flex', flexDirection: 'column', gap: '6px' },
  label: { fontSize: '10px', textTransform: 'uppercase', color: '#475569', fontWeight: "800", letterSpacing: '0.5px' },
  value: { fontSize: '15px', fontWeight: "700", color: "#f1f5f9" },
  
  footer: { marginTop: '30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: '20px' },
  priceContainer: { display: 'flex', flexDirection: 'column' },
  priceLabel: { fontSize: '11px', color: '#64748b', fontWeight: '700' },
  priceValue: { fontSize: '28px', fontWeight: '900', color: '#fff', letterSpacing: '-1px' },
  cartBtn: { 
    flex: 1, padding: "18px", color: "#fff", borderRadius: "18px", 
    border: "none", fontWeight: "800", cursor: "pointer", fontSize: '15px',
    boxShadow: '0 10px 20px -5px rgba(37, 99, 235, 0.4)',
    transition: 'transform 0.2s ease'
  }
};