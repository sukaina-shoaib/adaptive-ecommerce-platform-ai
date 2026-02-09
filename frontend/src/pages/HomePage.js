import React, { useEffect, useState, useMemo } from "react";
import Hero from "../components/Hero";
import CategorySidebar from "../components/CategorySidebar";
import ProductGrid from "../components/ProductGrid";
import ProductDetails from "../components/ProductDetails";
import { api } from "../services/Api";
import { addAiScores } from "../services/ai";
import { connectInventory } from "../services/realtime"; 

export default function HomePage({ searchQuery, onProductsLoaded }) {
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [selected, setSelected] = useState(null);
  const [activeCategory, setActiveCategory] = useState("ALL");
  const [isDataLoading, setIsDataLoading] = useState(true);

  // Helper to format raw product data from API
  const normalizeProduct = (p) => ({
    ...p,
    price: Number(p.currentPrice || p.price || 0),
    basePrice: Number(p.basePrice || p.currentPrice || p.price || 0),
    stock: p.stock || 0,
    imageUrl: p.image_url || p.imageUrl,
  });

  // 1. INITIAL FETCH
  useEffect(() => {
    setIsDataLoading(true);
    api.get("/products")
      .then(async (res) => {
        const normalized = res.data.map(normalizeProduct);
        const scored = await addAiScores(normalized);
        setProducts(scored);
        if (onProductsLoaded) onProductsLoaded(scored);
      })
      .catch((err) => console.error("Product fetch failed:", err))
      .finally(() => setIsDataLoading(false));

    api.get("/products/categories")
      .then((res) => setCategories(res.data))
      .catch((err) => console.error("Category fetch failed:", err));
  }, []);

  // 2. REAL-TIME OBSERVER SYNC
  useEffect(() => {
    const disconnect = connectInventory((updatedProduct) => {
      console.log("🚀 Real-time Update Received:", updatedProduct);
      
      const normalized = normalizeProduct(updatedProduct);

      setProducts((prevProducts) => {
        const newItems = prevProducts.map((p) => 
          p.id === normalized.id ? { ...p, ...normalized } : p
        );
        
        // Re-run AI ranking as price/stock changes affect value
        addAiScores(newItems).then(scored => setProducts(scored));
        return newItems;
      });

      setSelected(prev => (prev?.id === normalized.id ? normalized : prev));
    });

    return () => disconnect(); 
  }, []);

  const filtered = useMemo(() => {
    let list = [...products];
    if (activeCategory !== "ALL") {
      list = list.filter(p => 
        String(p.category || "").toLowerCase() === String(activeCategory).toLowerCase()
      );
    }
    if (searchQuery && searchQuery.trim() !== "") {
      const term = searchQuery.toLowerCase();
      list = list.filter(p => 
        p.name.toLowerCase().includes(term) || 
        (p.category && p.category.toLowerCase().includes(term))
      );
    }
    return list.sort((a, b) => (b.aiScore || 0) - (a.aiScore || 0));
  }, [products, activeCategory, searchQuery]);

  return (
    <div style={styles.container}>
      <div style={styles.ambientGlow}></div>
      <div style={styles.heroWrapper}>
        <Hero 
          onSelect={setSelected} 
          title={searchQuery ? `Results for "${searchQuery}"` : `${activeCategory} Collection`}
        />
      </div>

      <div style={styles.mainLayout}>
        <aside style={styles.sidebar}>
          <div style={styles.sidebarLabel}>categories</div>
          <CategorySidebar categories={categories} active={activeCategory} onPick={setActiveCategory} />
        </aside>

        <main style={styles.gridSection}>
          <div style={styles.gridHeader}>
            <h3 style={styles.sectionTitle}>
              {activeCategory === "ALL" ? "Marketplace" : activeCategory}
              <span style={styles.countBadge}>{filtered.length} items</span>
            </h3>
            <div style={styles.aiFilterLabel}>⚡ AI Ranked</div>
          </div>
          <ProductGrid products={filtered} onSelect={setSelected} />
        </main>

        <aside style={styles.detailsSection}>
          {selected ? (
            <div className="fade-in" style={styles.detailsContainer}>
               <ProductDetails product={selected} />
            </div>
          ) : (
            <div style={styles.emptyDetails}>
              <div style={styles.emptyIcon}>✨</div>
              <p style={styles.emptyHeading}>Intelligent View</p>
              <p style={styles.emptyText}>Select a product to analyze real-time data.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}

const styles = {
    container: { padding: "100px 40px 60px", maxWidth: "1600px", margin: "0 auto", background: "#0f172a", minHeight: "100vh", position: 'relative', overflow: 'hidden' },
    ambientGlow: { position: 'absolute', top: '-10%', left: '30%', width: '40vw', height: '40vh', background: 'radial-gradient(circle, rgba(37, 99, 235, 0.1) 0%, transparent 70%)', zIndex: 0, pointerEvents: 'none' },
    heroWrapper: { position: 'relative', zIndex: 1, marginBottom: '20px' },
    mainLayout: { display: "flex", marginTop: "40px", gap: "32px", alignItems: "flex-start", position: 'relative', zIndex: 1 },
    sidebar: { width: "240px", position: "sticky", top: "100px", height: "fit-content", background: "rgba(255, 255, 255, 0.03)", borderRadius: "20px", padding: "20px", border: "1px solid rgba(255, 255, 255, 0.08)", backdropFilter: 'blur(10px)' },
    sidebarLabel: { fontSize: '11px', fontWeight: '800', color: '#64748b', textTransform: 'uppercase', letterSpacing: '1px', marginBottom: '20px', paddingLeft: '10px' },
    gridSection: { flex: 1, minHeight: "500px" },
    gridHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px', padding: '0 8px' },
    sectionTitle: { fontSize: '24px', color: '#fff', fontWeight: '800', margin: 0, display: 'flex', alignItems: 'center', gap: '12px' },
    countBadge: { fontSize: '12px', background: 'rgba(255,255,255,0.1)', padding: '4px 10px', borderRadius: '8px', color: '#94a3b8' },
    aiFilterLabel: { fontSize: '12px', fontWeight: '700', color: '#3b82f6', background: 'rgba(59, 130, 246, 0.1)', padding: '6px 14px', borderRadius: '10px' },
    detailsSection: { width: "380px", position: "sticky", top: "100px", height: "fit-content" },
    detailsContainer: { animation: 'fadeIn 0.4s ease-out' },
    emptyDetails: { padding: "80px 30px", background: "rgba(255, 255, 255, 0.03)", borderRadius: "32px", border: "1px solid rgba(255, 255, 255, 0.08)", textAlign: "center", backdropFilter: 'blur(10px)' },
    emptyIcon: { fontSize: "42px", marginBottom: "20px", opacity: 0.5 },
    emptyHeading: { color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "8px" },
    emptyText: { color: "#64748b", fontSize: "14px", fontWeight: "500", lineHeight: "1.6" }
};