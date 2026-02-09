import { useEffect, useState, useContext } from "react";
import { UserContext } from "../context/UserContext";
import { api } from "../services/Api";

export default function InboxPage() {
  const { user } = useContext(UserContext);
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [hoveredId, setHoveredId] = useState(null);

  const loadInbox = () => {
    if (user && user.id) {
      setLoading(true);
      api.get(`/inbox/${user.id}`)
        .then(res => {
          setMessages(res.data);
          setLoading(false);
        })
        .catch(() => setLoading(false));
    }
  };

  useEffect(() => {
    loadInbox();
  }, [user]);

  const handleClearAll = () => {
    if (!user) return;
    if (window.confirm("Archive all notifications permanently?")) {
      api.delete(`/inbox/user/${user.id}`)
        .then(() => setMessages([]))
        .catch(err => console.error("Action failed", err));
    }
  };

  return (
    <div style={styles.pageWrapper}>
      {/* INJECTING ANIMATIONS */}
      <style>{`
        @keyframes slideUpFade {
          from { opacity: 0; transform: translateY(20px); }
          to { opacity: 1; transform: translateY(0); }
        }
        .message-card {
          animation: slideUpFade 0.5s ease forwards;
        }
      `}</style>

      <div style={styles.ambientGlow}></div>

      <div style={styles.container}>
        {/* HEADER SECTION */}
        <div style={styles.header}>
          <div>
            <h1 style={styles.mainTitle}>Activity</h1>
            <p style={styles.subtitle}>
              {messages.length === 0 ? "No new updates" : `Monitoring ${messages.length} recent events`}
            </p>
          </div>
          {messages.length > 0 && (
            <button 
              style={styles.clearBtn} 
              onClick={handleClearAll}
              onMouseEnter={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.2)'}
              onMouseLeave={(e) => e.target.style.background = 'rgba(239, 68, 68, 0.1)'}
            >
              Clear ALL
            </button>
          )}
        </div>

        {/* MESSAGES LIST */}
        <div style={styles.list}>
          {loading ? (
            <div style={styles.loader}>Syncing encrypted data...</div>
          ) : messages.length === 0 ? (
            <div style={styles.emptyState}>
              <div style={styles.emptyIcon}>✨</div>
              <h3 style={styles.emptyHeading}>All Clear</h3>
              <p style={styles.emptyText}>Your activity feed is empty. New notifications will appear here in real-time.</p>
            </div>
          ) : (
            messages.map((n, i) => (
              <div 
                key={n.id} 
                className="message-card"
                style={{
                  ...styles.card, 
                  animationDelay: `${i * 0.1}s`,
                  borderColor: hoveredId === n.id ? 'rgba(59, 130, 246, 0.3)' : 'rgba(255, 255, 255, 0.05)',
                  transform: hoveredId === n.id ? 'scale(1.01)' : 'scale(1)'
                }}
                onMouseEnter={() => setHoveredId(n.id)}
                onMouseLeave={() => setHoveredId(null)}
              >
                <div style={styles.cardContent}>
                  <p style={styles.messageText}>{n.message}</p>
                  <span style={styles.timestamp}>
                    {new Date(n.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                </div>
                <button 
                  style={styles.closeBtn} 
                  onClick={() => api.delete(`/inbox/${n.id}`).then(loadInbox)}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"></line><line x1="6" y1="6" x2="18" y2="18"></line></svg>
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

const styles = {
  pageWrapper: {
    minHeight: "100vh",
    background: "#0f172a",
    padding: "120px 20px 60px",
    position: "relative",
    overflow: "hidden"
  },
  ambientGlow: {
    position: 'absolute', top: '0', left: '25%', width: '50vw', height: '40vh',
    background: 'radial-gradient(circle, rgba(59, 130, 246, 0.06) 0%, transparent 70%)',
    zIndex: 0, pointerEvents: 'none'
  },
  container: {
    maxWidth: "600px",
    margin: "0 auto",
    position: "relative",
    zIndex: 1
  },
  header: {
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: "40px",
  },
  mainTitle: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#fff",
    margin: 0,
    letterSpacing: "-0.5px"
  },
  subtitle: {
    color: "#64748b",
    margin: "6px 0 0 0",
    fontSize: "14px",
    fontWeight: "500"
  },
  clearBtn: {
    background: "rgba(239, 68, 68, 0.1)",
    border: "1px solid rgba(239, 68, 68, 0.2)",
    padding: "8px 16px",
    borderRadius: "10px",
    cursor: "pointer",
    fontSize: "12px",
    fontWeight: "700",
    color: "#ef4444",
    transition: "all 0.3s ease"
  },
  list: {
    display: "flex",
    flexDirection: "column",
    gap: "12px"
  },
  card: {
    display: "flex",
    alignItems: "center",
    background: "rgba(30, 41, 59, 0.4)",
    backdropFilter: "blur(10px)",
    borderRadius: "20px",
    padding: "20px 24px",
    border: "1px solid rgba(255, 255, 255, 0.05)",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    opacity: 0, // Controlled by animation
  },
  cardContent: { flex: 1 },
  messageText: {
    margin: 0,
    fontSize: "15px",
    fontWeight: "500",
    color: "#f1f5f9",
    lineHeight: "1.5"
  },
  timestamp: { 
    fontSize: "11px", 
    color: "#475569", 
    fontWeight: "700", 
    textTransform: "uppercase",
    display: 'block',
    marginTop: '8px'
  },
  closeBtn: {
    background: "none",
    border: "none",
    color: "#475569",
    cursor: "pointer",
    padding: "8px",
    marginLeft: "15px",
    display: 'flex',
    alignItems: 'center',
    transition: 'color 0.2s',
    ":hover": { color: "#fff" }
  },
  emptyState: {
    textAlign: "center",
    padding: "60px 20px",
    background: "rgba(255,255,255,0.02)",
    borderRadius: "24px",
    border: "1px solid rgba(255,255,255,0.05)"
  },
  emptyIcon: { fontSize: "40px", marginBottom: "16px", opacity: 0.3 },
  emptyHeading: { color: "#fff", fontSize: "18px", fontWeight: "700", marginBottom: "8px" },
  emptyText: { color: "#64748b", fontSize: "13px", lineHeight: "1.6" },
  loader: {
    textAlign: "center",
    padding: "100px 0",
    color: "#3b82f6",
    fontSize: "13px",
    fontWeight: "700",
    letterSpacing: "1px",
    textTransform: "uppercase"
  }
};