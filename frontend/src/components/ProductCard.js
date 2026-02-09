import { useContext, useState } from "react";
import { CartContext } from "../context/cartContext";
import { BACKEND_BASE_URL } from "../services/Config";

/**
 * ProductCard Component
 * Modernized for a Midnight Glass aesthetic with hover animations.
 */
export default function ProductCard({ p, onSelect, showAddToCart = true }) {
  const { addItem } = useContext(CartContext);
  const [isHovered, setIsHovered] = useState(false);

  // 1. Normalize image path
  const rawImg = p.image_url || p.imageUrl;
  const imgUrl = rawImg 
    ? (rawImg.startsWith("http") ? rawImg : `${BACKEND_BASE_URL}/images/${rawImg}`)
    : "https://via.placeholder.com/400";

  // 2. Pricing Logic
  const original = Number(p.basePrice || 0);
  const current = Number(p.price || p.currentPrice || 0);
  const hasDiscount = current > 0 && original > 0 && current < original;

  return (
    <div 
      style={{
        ...styles.card,
        transform: isHovered ? "translateY(-8px)" : "translateY(0)",
        borderColor: isHovered ? "rgba(59, 130, 246, 0.4)" : "rgba(255, 255, 255, 0.08)",
        boxShadow: isHovered ? "0 20px 40px rgba(0,0,0,0.4)" : "0 10px 30px rgba(0,0,0,0.1)"
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* IMAGE CONTAINER WITH ZOOM */}
      <div style={styles.imageWrapper} onClick={() => onSelect(p)}>
        <img 
          src={imgUrl} 
          alt={p.name} 
          style={{
            ...styles.image,
            transform: isHovered ? "scale(1.1)" : "scale(1)"
          }} 
        />
        <div style={styles.imgOverlay} />
        
        {/* SAVINGS BADGE */}
        {hasDiscount && (
          <div style={styles.discountBadge}>
            -{Math.round(((original - current) / original) * 100)}%
          </div>
        )}
      </div>
      
      <div style={styles.body} onClick={() => onSelect(p)}>
        <div style={styles.metaRow}>
          <span style={styles.categoryBadge}>{p.category || "General"}</span>
          <span style={styles.stockInfo}>
             <span style={{ color: p.stock < 5 ? '#f59e0b' : '#10b981' }}>●</span> {p.stock} in stock
          </span>
        </div>

        <h4 style={styles.title}>{p.name}</h4>
        
        {/* ADAPTIVE PRICING */}
        <div style={styles.priceContainer}>
          {hasDiscount ? (
            <>
              <span style={styles.discountPrice}>Rs {current.toLocaleString()}</span>
              <span style={styles.strikePrice}>Rs {original.toLocaleString()}</span>
            </>
          ) : (
            <span style={styles.normalPrice}>Rs {current.toLocaleString()}</span>
          )}
        </div>

        {/* CUSTOM DECORATORS */}
        <div style={styles.badgeRow}>
            {p.badges?.map((badge, index) => (
                <span key={index} style={styles.badge}>{badge}</span>
            ))}
            {p.aiScore > 0.8 && <span style={styles.aiBadge}>✨ AI Choice</span>}
        </div>
      </div>

      {showAddToCart && (
        <div style={styles.btnWrapper}>
          <button
            style={{
              ...styles.cartBtn,
              background: p.stock === 0 ? "rgba(255,255,255,0.05)" : "linear-gradient(135deg, #3b82f6 0%, #2563eb 100%)",
              color: p.stock === 0 ? "#475569" : "#fff",
              cursor: p.stock === 0 ? "not-allowed" : "pointer",
            }}
            disabled={p.stock === 0}
            onClick={(e) => {
              e.stopPropagation();
              addItem(p);
            }}
          >
            {p.stock === 0 ? "Out of Stock" : "Add to Cart"}
          </button>
        </div>
      )}
    </div>
  );
}

const styles = {
  card: { 
    background: "rgba(30, 41, 59, 0.4)", 
    backdropFilter: "blur(12px)",
    borderRadius: "24px", 
    border: '1px solid rgba(255, 255, 255, 0.08)',
    overflow: "hidden", 
    display: "flex", 
    flexDirection: "column",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    cursor: "pointer"
  },
  imageWrapper: { 
    position: 'relative', 
    height: 200, 
    overflow: 'hidden' 
  },
  image: { 
    width: "100%", 
    height: "100%", 
    objectFit: "cover", 
    transition: "transform 0.6s ease" 
  },
  imgOverlay: {
    position: 'absolute', top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.8))'
  },
  discountBadge: {
    position: 'absolute', top: 12, right: 12,
    background: '#ef4444', color: '#fff',
    padding: '4px 8px', borderRadius: '8px',
    fontSize: '12px', fontWeight: '900', zIndex: 2
  },
  body: { padding: 20, flex: 1 },
  metaRow: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 },
  title: { margin: 0, fontSize: '18px', fontWeight: '700', color: "#fff", lineHeight: 1.3 },
  categoryBadge: { fontSize: '10px', color: '#3b82f6', fontWeight: '800', textTransform: 'uppercase', letterSpacing: '1px' },
  stockInfo: { fontSize: '11px', color: "#64748b", fontWeight: '600' },
  
  priceContainer: { display: 'flex', alignItems: 'center', gap: '10px', marginTop: '12px' },
  strikePrice: { textDecoration: 'line-through', color: '#475569', fontSize: '13px', fontWeight: '500' },
  discountPrice: { color: '#10b981', fontWeight: '800', fontSize: '22px', letterSpacing: '-1px' },
  normalPrice: { fontWeight: '800', fontSize: '20px', color: '#fff' },

  badgeRow: { display: 'flex', flexWrap: 'wrap', gap: '6px', marginTop: '16px' },
  badge: { 
    background: 'rgba(255,255,255,0.05)', color: '#94a3b8', 
    padding: '4px 10px', borderRadius: '8px', 
    fontSize: '10px', fontWeight: '700', border: '1px solid rgba(255,255,255,0.1)'
  },
  aiBadge: {
    background: 'linear-gradient(135deg, #6366f1 0%, #a855f7 100%)',
    color: '#fff', padding: '4px 10px', borderRadius: '8px', 
    fontSize: '10px', fontWeight: '800'
  },
  
  btnWrapper: { padding: '0 20px 20px' },
  cartBtn: { 
    width: '100%', padding: '14px', borderRadius: '14px',
    border: 'none', fontWeight: '800', fontSize: '14px',
    transition: 'transform 0.2s ease',
    boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.3)'
  }
};