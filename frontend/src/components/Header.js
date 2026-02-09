import { useContext, useState, useEffect } from "react";
import { CartContext } from "../context/cartContext";
import { UserContext } from "../context/UserContext";
import { useNavigate } from "react-router-dom";

export default function Header({ products = [], onSearchTriggered }) {
  const { cartItems, clearCart } = useContext(CartContext);
  const { user, logout } = useContext(UserContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState("");
  const [suggestions, setSuggestions] = useState([]);
  const [isScrolled, setIsScrolled] = useState(false);
  const [hasUnread, setHasUnread] = useState(true);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const cartCount = cartItems.reduce((s, i) => s + i.quantity, 0);

  const handleLogout = () => {
    logout();
    clearCart();
    navigate("/");
  };

  const handleInputChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    if (val.trim().length > 0) {
      const matches = products.filter(p => 
        p.name.toLowerCase().includes(val.toLowerCase())
      ).slice(0, 5); 
      setSuggestions(matches);
    } else {
      setSuggestions([]);
    }
  };

  const handleSearchAction = (searchTerm) => {
    setQuery(searchTerm);
    onSearchTriggered(searchTerm);
    setSuggestions([]);
    navigate("/"); 
  };

  return (
    <header style={{
      ...styles.header,
      backgroundColor: isScrolled ? 'rgba(15, 23, 42, 0.95)' : 'rgba(15, 23, 42, 0.4)',
      borderBottom: isScrolled ? '1px solid rgba(255, 255, 255, 0.1)' : '1px solid transparent',
      backdropFilter: 'blur(16px)'
    }}>
      <div style={styles.navContainer}>
        
        <div style={styles.logo} onClick={() => navigate("/")}>
          <span style={styles.logoIcon}>◈</span>
          ADAPTIVE<span style={styles.logoAccent}>MART</span>
        </div>

        <div style={styles.searchWrapper}>
          <div style={styles.searchBar}>
            <span style={styles.searchIcon}>🔍</span>
            <input
              placeholder="Search..."
              style={styles.input}
              value={query}
              onChange={handleInputChange}
              onKeyPress={(e) => e.key === 'Enter' && handleSearchAction(query)}
            />
            <button style={styles.searchBtn} onClick={() => handleSearchAction(query)}>Search</button>
          </div>

          {suggestions.length > 0 && (
            <div style={styles.dropdown}>
              {suggestions.map(p => (
                <div key={p.id} style={styles.suggestionItem} onClick={() => handleSearchAction(p.name)}>
                  <div style={styles.suggestionText}>
                    <span style={styles.suggestionName}>{p.name}</span>
                    <small style={styles.suggestionCat}>{p.category}</small>
                  </div>
                  <span style={styles.suggestionArrow}>→</span>
                </div>
              ))}
            </div>
          )}
        </div>

        <div style={styles.headerActions}>
          <button style={styles.navBtn} onClick={() => navigate("/")}>Home</button>
          
          <div style={styles.iconWrapper} onClick={() => navigate("/cart")}>
            <button style={styles.navBtn}>🛒 Cart</button>
            {cartCount > 0 && <span style={styles.badge}>{cartCount}</span>}
          </div>

          {user ? (
            <>
              <div style={styles.divider}></div>
              
              <div 
                style={styles.iconWrapper} 
                onClick={() => { setHasUnread(false); navigate("/inbox"); }}
              >
                <button style={styles.navBtn}>
                   <span style={{fontSize: '18px'}}>🔔</span>
                   <span>Inbox</span>
                </button>
                {hasUnread && <span className="pulse-dot" style={styles.pulseDot}></span>}
              </div>
              
              <div style={styles.userProfile}>
                <div style={styles.avatar}>{user.name ? user.name.charAt(0) : 'U'}</div>
                <span style={styles.userName}>{user.name ? user.name.split(' ')[0] : 'User'}</span>
              </div>
              
              <button style={styles.logoutBtn} onClick={handleLogout}>Logout</button>
            </>
          ) : (
            <>
              <div style={styles.divider}></div>
              <button style={styles.loginBtn} onClick={() => navigate("/login")}>Login</button>
              <button style={styles.signUpBtn} onClick={() => navigate("/register")}>Sign Up</button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

const styles = {
  header: {
    position: 'fixed', top: 0, left: 0, right: 0, height: '70px',
    display: 'flex', alignItems: 'center', zIndex: 1000,
    transition: 'all 0.3s ease',
  },
  navContainer: {
    width: '95%', maxWidth: '1600px', margin: '0 auto',
    display: 'flex', alignItems: 'center', justifyContent: 'space-between'
  },
  logo: { fontSize: '20px', fontWeight: '900', color: '#fff', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' },
  logoIcon: { color: '#3b82f6', fontSize: '24px' },
  logoAccent: { color: '#3b82f6' },
  searchWrapper: { position: 'relative', width: '25%', minWidth: '250px' },
  searchBar: { display: 'flex', alignItems: 'center', gap: '8px', backgroundColor: 'rgba(255, 255, 255, 0.05)', border: '1px solid rgba(255, 255, 255, 0.1)', padding: '4px 4px 4px 12px', borderRadius: '12px' },
  searchIcon: { opacity: 0.4, fontSize: '13px' },
  input: { background: 'none', border: 'none', color: '#fff', outline: 'none', width: '100%', fontSize: '13px' },
  searchBtn: { backgroundColor: '#3b82f6', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '700', cursor: 'pointer' },
  
  /* Reduced gaps here */
  headerActions: { display: 'flex', alignItems: 'center', gap: '12px' }, 
  navBtn: { background: 'none', border: 'none', color: '#cbd5e1', fontSize: '13px', fontWeight: '600', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' },
  iconWrapper: { position: 'relative', display: 'flex', alignItems: 'center', cursor: 'pointer', padding: '0 4px' },
  
  badge: { position: 'absolute', top: '-6px', right: '-4px', backgroundColor: '#3b82f6', color: '#fff', fontSize: '9px', padding: '1px 5px', borderRadius: '6px', fontWeight: '800' },
  pulseDot: { position: 'absolute', top: '2px', right: '4px', width: '8px', height: '8px', backgroundColor: '#ef4444', borderRadius: '50%', border: '1.5px solid #0f172a' },
  divider: { width: '1px', height: '20px', backgroundColor: 'rgba(255, 255, 255, 0.1)', margin: '0 2px' },
  userProfile: { display: 'flex', alignItems: 'center', gap: '8px', marginLeft: '4px' },
  avatar: { width: '28px', height: '28px', borderRadius: '8px', backgroundColor: 'rgba(59, 130, 246, 0.2)', color: '#3b82f6', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '12px', border: '1px solid rgba(59, 130, 246, 0.3)' },
  userName: { color: '#f8fafc', fontSize: '13px', fontWeight: '600' },
  logoutBtn: { backgroundColor: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: '1px solid rgba(239, 68, 68, 0.2)', padding: '5px 10px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer', marginLeft: '4px' },
  loginBtn: { background: 'none', border: 'none', color: '#fff', fontSize: '13px', fontWeight: '600', cursor: 'pointer' },
  signUpBtn: { backgroundColor: '#fff', color: '#0f172a', border: 'none', padding: '6px 14px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer' },
  dropdown: { position: 'absolute', top: '45px', left: 0, width: '100%', backgroundColor: 'rgba(30, 41, 59, 0.98)', backdropFilter: 'blur(20px)', borderRadius: '12px', border: '1px solid rgba(255, 255, 255, 0.1)', overflow: 'hidden' },
  suggestionItem: { padding: '10px 15px', cursor: 'pointer', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid rgba(255, 255, 255, 0.03)' },
  suggestionText: { display: 'flex', flexDirection: 'column' },
  suggestionName: { color: '#f8fafc', fontSize: '13px', fontWeight: '600' },
  suggestionCat: { color: '#64748b', fontSize: '10px', textTransform: 'uppercase' },
};