import React, { useState } from "react";

export default function CategorySidebar({ categories, active, onPick }) {
  const [hovered, setHovered] = useState(null);

  const handlePick = (cat) => {
    onPick(cat);
  };

  const getBtnStyle = (cat) => {
    const isActive = active === cat;
    const isHovered = hovered === cat;

    return {
      ...styles.btn,
      backgroundColor: isActive 
        ? "rgba(59, 130, 246, 0.15)" 
        : isHovered 
          ? "rgba(255, 255, 255, 0.05)" 
          : "transparent",
      color: isActive ? "#3b82f6" : isHovered ? "#f8fafc" : "#94a3b8",
      borderColor: isActive ? "#3b82f6" : "transparent",
      transform: isHovered ? "translateX(5px)" : "translateX(0)",
      boxShadow: isActive ? "0 0 20px rgba(59, 130, 246, 0.1)" : "none",
    };
  };

  return (
    <div style={styles.container}>
      <div style={styles.headerGroup}>
        <span style={styles.icon}>🧭</span>
        <h3 style={styles.title}>Discovery</h3>
      </div>
      
      <div style={styles.list}>
        {/* ALL PRODUCTS BUTTON */}
        <button
          style={getBtnStyle("ALL")}
          onMouseEnter={() => setHovered("ALL")}
          onMouseLeave={() => setHovered(null)}
          onClick={() => handlePick("ALL")}
        >
          <span style={styles.dot(active === "ALL")}>●</span>
          All Collections
        </button>

        {/* DYNAMIC CATEGORY BUTTONS */}
        {categories.map((c) => (
          <button
            key={c}
            style={getBtnStyle(c)}
            onMouseEnter={() => setHovered(c)}
            onMouseLeave={() => setHovered(null)}
            onClick={() => handlePick(c)}
          >
            <span style={styles.dot(active === c)}>●</span>
            {c}
          </button>
        ))}
      </div>
    </div>
  );
}

const styles = {
  container: { 
    padding: "10px", 
    background: "transparent", 
    height: "fit-content"
  },
  headerGroup: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginBottom: '20px',
    paddingLeft: '12px'
  },
  icon: { fontSize: '18px' },
  title: { 
    fontSize: "12px", 
    fontWeight: "800", 
    color: "#64748b", 
    textTransform: "uppercase", 
    letterSpacing: "1.5px", 
    margin: 0
  },
  list: { 
    display: "flex", 
    flexDirection: "column", 
    gap: "6px" 
  },
  btn: {
    padding: "12px 16px",
    textAlign: "left",
    border: "1px solid transparent",
    borderRadius: "12px",
    cursor: "pointer",
    fontSize: "14px",
    fontWeight: "600",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    outline: "none",
    display: "flex",
    alignItems: "center",
    gap: "12px",
    width: "100%"
  },
  dot: (isActive) => ({
    fontSize: '8px',
    color: isActive ? '#3b82f6' : 'transparent',
    transition: 'all 0.3s ease',
    textShadow: isActive ? '0 0 8px #3b82f6' : 'none'
  })
};