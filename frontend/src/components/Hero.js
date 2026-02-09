import React, { useEffect, useState } from "react";
import axios from "axios";
import { BACKEND_BASE_URL } from "../services/Config";

export default function Hero({ onSelect }) {
  const [recs, setRecs] = useState([]);
  const [hoveredId, setHoveredId] = useState(null);

  useEffect(() => {
    axios
      .get(`${BACKEND_BASE_URL}/api/recommendations/1`)
      .then((res) => {
        const clean = res.data.map((p) => {
          const price = Number(p.price ?? p.currentPrice ?? p.current_price ?? 0);
          const basePrice = Number(p.basePrice ?? price);
          const hasDiscount = basePrice > 0 && price > 0 && price < basePrice;
          const rawImg = p.imageUrl || p.image_url;

          return {
            ...p,
            price,
            basePrice,
            hasDiscount,
            displayImage: rawImg
              ? rawImg.startsWith("http")
                ? rawImg
                : `${BACKEND_BASE_URL}/images/${rawImg}`
              : "https://via.placeholder.com/400", // Larger placeholder
          };
        });

        setRecs(clean.slice(0, 4)); // Increased to 4 for better row balance
      })
      .catch((err) => console.error("Hero Fetch Error:", err));
  }, []);

  return (
    <section style={styles.hero}>
      <div style={styles.header}>
        <h2 style={styles.title}>
          <span style={styles.sparkle}>✨</span> Personalized Recommendations 
        </h2>
        <p style={styles.subtitle}>AI-powered recommendations </p>
      </div>

      <div style={styles.row}>
        {recs.map((p) => (
          <div
            key={p.id}
            style={{
              ...styles.card,
              transform: hoveredId === p.id ? "translateY(-10px)" : "translateY(0)",
              borderColor: hoveredId === p.id ? "rgba(59, 130, 246, 0.5)" : "rgba(255, 255, 255, 0.1)",
            }}
            onMouseEnter={() => setHoveredId(p.id)}
            onMouseLeave={() => setHoveredId(null)}
            onClick={() => onSelect && onSelect(p)}
          >
            <div style={styles.imgWrapper}>
              <img src={p.displayImage} alt={p.name} style={styles.img} />
              <div style={styles.overlay} />
              
              {/* DECORATOR BADGES */}
              <div style={styles.badges}>
                {p.hasDiscount && <span style={styles.discountBadge}>SAVE {Math.round((1 - p.price/p.basePrice)*100)}%</span>}
                {p.badges?.map((b, i) => (
                  <span key={i} style={styles.badge}>{b}</span>
                ))}
              </div>
            </div>

            <div style={styles.content}>
              <h4 style={styles.prodName}>{p.name}</h4>
              <p style={styles.category}>{p.category || 'Special Edition'}</p>

              <div style={styles.priceContainer}>
                {p.hasDiscount ? (
                  <div style={styles.priceRow}>
                    <span style={styles.discountPrice}>Rs {p.price.toLocaleString()}</span>
                    <span style={styles.strike}>Rs {p.basePrice.toLocaleString()}</span>
                  </div>
                ) : (
                  <p style={styles.normalPrice}>Rs {p.price.toLocaleString()}</p>
                )}
                <button style={styles.viewBtn}>View</button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

/* ---------------- MODERN UI STYLES ---------------- */

const styles = {
  hero: {
    padding: "40px 0",
    background: "transparent",
    marginBottom: "40px",
    position: 'relative',
    zIndex: 1
  },
  header: {
    marginBottom: "30px",
  },
  title: { 
    fontSize: "28px", 
    fontWeight: "800", 
    color: "#f8fafc", 
    margin: "0 0 8px 0",
    letterSpacing: "-0.5px"
  },
  sparkle: { marginRight: '10px' },
  subtitle: {
    fontSize: "15px",
    color: "#94a3b8",
    margin: 0
  },
  row: { 
    display: "flex", 
    gap: "24px", 
    padding: "10px 5px",
    overflowX: "visible" 
  },
  card: {
    flex: 1,
    minWidth: "260px",
    background: "rgba(30, 41, 59, 0.5)",
    backdropFilter: "blur(12px)",
    borderRadius: "24px",
    cursor: "pointer",
    overflow: "hidden",
    border: "1px solid rgba(255, 255, 255, 0.1)",
    transition: "all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
    position: "relative",
  },
  imgWrapper: {
    width: "100%",
    height: "180px",
    position: "relative",
    overflow: "hidden"
  },
  img: { 
    width: "100%", 
    height: "100%", 
    objectFit: "cover",
    transition: "transform 0.5s ease"
  },
  overlay: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    background: 'linear-gradient(to bottom, transparent 60%, rgba(15, 23, 42, 0.8))'
  },
  content: { padding: "20px" },
  prodName: {
    fontSize: "17px",
    fontWeight: "700",
    color: "#fff",
    margin: "0 0 4px 0",
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis"
  },
  category: {
    fontSize: "12px",
    color: "#64748b",
    fontWeight: "600",
    textTransform: "uppercase",
    letterSpacing: "1px",
    marginBottom: "16px"
  },
  priceContainer: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  priceRow: { display: "flex", flexDirection: "column" },
  strike: {
    textDecoration: "line-through",
    fontSize: "12px",
    color: "#64748b",
  },
  discountPrice: {
    color: "#10b981", // Emerald green for prices
    fontWeight: "800",
    fontSize: "18px",
  },
  normalPrice: {
    color: "#fff",
    fontWeight: "800",
    fontSize: "18px",
  },
  viewBtn: {
    padding: '8px 16px',
    borderRadius: '10px',
    border: 'none',
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    color: '#fff',
    fontSize: '12px',
    fontWeight: '700',
    cursor: 'pointer',
    transition: 'background 0.2s'
  },
  badges: {
    position: "absolute",
    top: "12px",
    left: "12px",
    display: "flex",
    flexDirection: "column",
    gap: "6px",
    zIndex: 2
  },
  discountBadge: {
    background: "#ef4444",
    color: "#fff",
    fontSize: "10px",
    padding: "4px 8px",
    borderRadius: "8px",
    fontWeight: "900",
    letterSpacing: "0.5px"
  },
  badge: {
    background: "#3b82f6",
    color: "#fff",
    fontSize: "10px",
    padding: "4px 8px",
    borderRadius: "8px",
    fontWeight: "900",
  },
};