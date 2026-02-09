import React from "react";
import ProductCard from "./ProductCard";

/**
 * ProductGrid Component
 * Orchestrates the collection of ProductCards with fluid entrance animations.
 */
export default function ProductGrid({ products, onSelect }) {
  if (!products || products.length === 0) {
    return (
      <div style={styles.emptyContainer}>
        <div style={styles.loaderWrapper}>
          <div style={styles.shimmer}></div>
          <p style={styles.loadingText}>Curating your intelligent marketplace...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.gridWrapper}>
      <div style={styles.grid}>
        {products.map((p, index) => (
          <div 
            key={p.id} 
            style={{
              ...styles.cardAnimate,
              animationDelay: `${index * 0.05}s` // Staggered entrance
            }}
          >
            <ProductCard
              p={p}
              onSelect={onSelect}
              showAddToCart={true}
            />
          </div>
        ))}
      </div>
    </div>
  );
}

const styles = {
  gridWrapper: {
    width: "100%",
    perspective: "1000px", // Adds depth to entrance
  },
  grid: {
    display: "grid",
    // Increased min-width for a more premium "Bento" feel
    gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
    gap: "32px",
    padding: "10px",
  },
  cardAnimate: {
    animation: "slideUpFade 0.6s cubic-bezier(0.2, 1, 0.3, 1) both",
  },
  emptyContainer: {
    width: "100%",
    height: "400px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  loaderWrapper: {
    textAlign: "center",
    padding: "40px",
    borderRadius: "24px",
    background: "rgba(255, 255, 255, 0.02)",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    width: "100%",
    maxWidth: "400px",
    position: "relative",
    overflow: "hidden"
  },
  shimmer: {
    position: 'absolute',
    top: 0, left: '-100%',
    width: '100%', height: '100%',
    background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.03), transparent)',
    animation: 'shimmer 2s infinite',
  },
  loadingText: {
    color: "#64748b",
    fontSize: "15px",
    fontWeight: "600",
    letterSpacing: "0.5px",
    margin: 0
  }
};