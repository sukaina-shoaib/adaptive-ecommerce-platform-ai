import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';

const AdminPortal = () => {
    const [products, setProducts] = useState([]);
    const [orders, setOrders] = useState([]);
    const [categories, setCategories] = useState([]);
    
    // UPDATED: Added 'description' to the editForm state
    const [editingId, setEditingId] = useState(null);
    const [editForm, setEditForm] = useState({ name: '', basePrice: '', stock: '', category: '', description: '' });

    const [isAddingNewCategory, setIsAddingNewCategory] = useState(false);
    const [newCatName, setNewCatName] = useState('');
    const [selectedFile, setSelectedFile] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);

    const [newProduct, setNewProduct] = useState({ 
        name: '', 
        description: '',
        basePrice: '',   
        currentPrice: '', 
        stock: 10, 
        category: 'Electronics'
    });

    useEffect(() => { fetchAdminData(); }, []);

    const fetchAdminData = async () => {
        try {
            const prodRes = await axios.get('http://localhost:8080/api/products');
            const orderRes = await axios.get('http://localhost:8080/api/admin/orders');
            const catRes = await axios.get('http://localhost:8080/api/products/categories');
            
            setProducts(prodRes.data);
            setOrders(orderRes.data);
            const starterCats = ['Electronics', 'Sports', 'Health', 'Fashion'];
            const combinedCats = Array.from(new Set([...starterCats, ...catRes.data]));
            setCategories(combinedCats);
        } catch (err) { console.error("Sync Error", err); }
    };

    // --- EDIT LOGIC ---
    const startEdit = (p) => {
        setEditingId(p.id);
        setEditForm({
            name: p.name,
            basePrice: p.basePrice || p.price,
            stock: p.stock,
            category: p.category,
            description: p.description || '' // UPDATED: Pre-populate description
        });
    };

    const handleUpdate = async (id) => {
        try {
            await axios.put(`http://localhost:8080/api/admin/products/${id}`, {
                ...editForm,
                currentPrice: editForm.basePrice 
            });
            setEditingId(null);
            fetchAdminData();
            alert("SKU Updated Successfully!");
        } catch (err) {
            alert("Update Failed. Ensure backend has PUT /api/admin/products/{id} endpoint.");
        }
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file) {
            setSelectedFile(file);
            setImagePreview(URL.createObjectURL(file)); 
        }
    };

    const handleAddProduct = async (e) => {
        e.preventDefault();
        const finalCategory = isAddingNewCategory ? newCatName : newProduct.category;
        const formData = new FormData();
        const productData = JSON.stringify({
            ...newProduct,
            basePrice: parseFloat(newProduct.basePrice),
            currentPrice: parseFloat(newProduct.currentPrice),
            stock: parseInt(newProduct.stock),
            category: finalCategory,
        });

        const productBlob = new Blob([productData], { type: 'application/json' });
        formData.append('product', productBlob);
        formData.append('file', selectedFile);

        try {
            await axios.post('http://localhost:8080/api/admin/products', formData);
            alert("SKU Successfully Deployed!");
            setNewProduct({ name: '', description: '', basePrice: '', currentPrice: '', stock: 10, category: categories[0] });
            setSelectedFile(null); setImagePreview(null);
            setIsAddingNewCategory(false);
            fetchAdminData();
        } catch (err) { alert("Upload Failed."); }
    };

    const handleDelete = async (id) => {
        if (window.confirm("Confirm deletion?")) {
            try {
                await axios.delete(`http://localhost:8080/api/admin/products/${id}`);
                fetchAdminData();
            } catch (err) { alert("Error deleting product"); }
        }
    };

    return (
        <div style={styles.dashboardWrapper}>
            <style>{`
                .custom-scroll::-webkit-scrollbar { width: 6px; }
                .custom-scroll::-webkit-scrollbar-track { background: rgba(255, 255, 255, 0.02); }
                .custom-scroll::-webkit-scrollbar-thumb { background: rgba(59, 130, 246, 0.3); border-radius: 10px; }
                .edit-input { background: rgba(15, 23, 42, 0.8); border: 1px solid #3b82f6; color: white; padding: 4px 8px; border-radius: 6px; width: 100%; outline: none; }
                .edit-area { min-height: 40px; resize: vertical; font-family: inherit; }
            `}</style>

            <nav style={styles.navBar}>
                <div style={styles.logo}><span style={{color: '#fff'}}>ADAPTIVE</span><span style={{color: '#3b82f6'}}> MART</span></div>
                <Link to="/" style={styles.homeLink}>Home</Link>
            </nav>

            <div style={styles.gridContainer}>
                {/* LEFT: FORM */}
                <section style={styles.card}>
                    <div style={styles.cardHeader}><h3 style={styles.cardTitle}>Inventory Management</h3></div>
                    <form onSubmit={handleAddProduct} style={styles.form}>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Product Name</label>
                            <input type="text" style={styles.input} value={newProduct.name} onChange={e => setNewProduct({...newProduct, name: e.target.value})} required />
                        </div>
                        <div style={styles.inputGroup}>
                            <label style={styles.label}>Description</label>
                            <textarea style={{...styles.input, minHeight: '60px'}} value={newProduct.description} onChange={e => setNewProduct({...newProduct, description: e.target.value})} />
                        </div>
                        <div style={styles.row}>
                            <div style={{flex: 1, ...styles.inputGroup}}>
                                <label style={styles.label}>Price (Rs)</label>
                                <input type="number" style={styles.input} value={newProduct.basePrice} onChange={e => setNewProduct({...newProduct, basePrice: e.target.value, currentPrice: e.target.value})} required />
                            </div>
                            <div style={{flex: 1, ...styles.inputGroup}}>
                                <label style={styles.label}>Discount (Auto)</label>
                                <input type="number" style={{...styles.input, opacity: 0.5, cursor: 'not-allowed'}} value={newProduct.currentPrice} readOnly />
                            </div>
                        </div>
                        <div style={styles.row}>
                            <div style={{flex: 1, ...styles.inputGroup}}>
                                <label style={styles.label}>Stock</label>
                                <input type="number" style={styles.input} value={newProduct.stock} onChange={e => setNewProduct({...newProduct, stock: e.target.value})} required />
                            </div>
                            <div style={{flex: 1, ...styles.inputGroup}}>
                                <label style={styles.label}>Category</label>
                                <div style={{display: 'flex', gap: '8px'}}>
                                    {!isAddingNewCategory ? (
                                        <select style={styles.select} value={newProduct.category} onChange={e => setNewProduct({...newProduct, category: e.target.value})}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select>
                                    ) : (
                                        <input type="text" style={styles.input} onChange={e => setNewCatName(e.target.value)} required />
                                    )}
                                    <button type="button" style={styles.outlineBtn} onClick={() => setIsAddingNewCategory(!isAddingNewCategory)}>{isAddingNewCategory ? '✕' : '＋'}</button>
                                </div>
                            </div>
                        </div>
                        <div style={styles.uploadBox}>
                            <label style={styles.fileLabel}>{selectedFile ? '✅ Staged' : '📸 Upload Image'}<input type="file" style={{display: 'none'}} onChange={handleFileChange} /></label>
                            {imagePreview && <img src={imagePreview} alt="Preview" style={styles.previewImg} />}
                        </div>
                        <button type="submit" style={styles.primaryBtn}>Deploy SKU</button>
                    </form>
                </section>

                {/* RIGHT: ORDERS */}
                <section style={{...styles.card, background: 'rgba(15, 23, 42, 0.4)'}}>
                    <div style={styles.cardHeader}><h3 style={styles.cardTitle}>Recent Orders</h3></div>
                    <div className="custom-scroll" style={styles.orderViewport}>
                        {orders.map((order) => (
                            <div key={order.id} style={styles.orderItem}>
                                <div><div style={{fontWeight: 'bold', color: '#f8fafc'}}>ORDER #{order.id}</div></div>
                                <div style={styles.priceTag}>Rs {order.totalAmount || order.total}</div>
                            </div>
                        ))}
                    </div>
                </section>
            </div>

            {/* BOTTOM: INVENTORY LOG TABLE WITH DESCRIPTION */}
            <div style={{...styles.card, marginTop: '30px', padding: '0', overflow: 'hidden'}}>
                <div style={styles.tableHeader}><h3 style={styles.cardTitle}>Inventory Log</h3></div>
                <table style={styles.table}>
                    <thead>
                        <tr>
                            <th style={styles.th}>Name</th>
                            <th style={{...styles.th, width: '25%'}}>Description</th>
                            <th style={styles.th}>Price</th>
                            <th style={styles.th}>Stock</th>
                            <th style={styles.th}>Category</th>
                            <th style={styles.th}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {products.map(p => (
                            <tr key={p.id} style={styles.tr}>
                                <td style={styles.td}>
                                    {editingId === p.id ? 
                                        <input className="edit-input" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} /> : 
                                        p.name}
                                </td>
                                <td style={styles.td}>
                                    {editingId === p.id ? 
                                        <textarea className="edit-input edit-area" value={editForm.description} onChange={e => setEditForm({...editForm, description: e.target.value})} /> : 
                                        <div style={styles.descriptionTruncate}>{p.description}</div>}
                                </td>
                                <td style={styles.td}>
                                    {editingId === p.id ? 
                                        <input type="number" className="edit-input" value={editForm.basePrice} onChange={e => setEditForm({...editForm, basePrice: e.target.value})} /> : 
                                        `Rs ${p.basePrice || p.price}`}
                                </td>
                                <td style={styles.td}>
                                    {editingId === p.id ? 
                                        <input type="number" className="edit-input" value={editForm.stock} onChange={e => setEditForm({...editForm, stock: e.target.value})} /> : 
                                        p.stock}
                                </td>
                                <td style={styles.td}>
                                    {editingId === p.id ? 
                                        <select className="edit-input" value={editForm.category} onChange={e => setEditForm({...editForm, category: e.target.value})}>
                                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                                        </select> : 
                                        <span style={styles.categoryPill}>{p.category}</span>}
                                </td>
                                <td style={styles.td}>
                                    <div style={{display: 'flex', gap: '8px'}}>
                                        {editingId === p.id ? (
                                            <>
                                                <button onClick={() => handleUpdate(p.id)} style={styles.saveBtn}>Save</button>
                                                <button onClick={() => setEditingId(null)} style={styles.cancelBtn}>Cancel</button>
                                            </>
                                        ) : (
                                            <>
                                                <button onClick={() => startEdit(p)} style={styles.editBtn}>Edit</button>
                                                <button onClick={() => handleDelete(p.id)} style={styles.deleteBtn}>Remove</button>
                                            </>
                                        )}
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

// Styles
const styles = {
    dashboardWrapper: { padding: '20px 40px', backgroundColor: '#0f172a', minHeight: '100vh' },
    navBar: { display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid rgba(255,255,255,0.05)', marginBottom: '30px' },
    logo: { fontSize: '20px', fontWeight: '800' },
    homeLink: { color: '#94a3b8', textDecoration: 'none', fontSize: '14px' },
    gridContainer: { display: 'grid', gridTemplateColumns: '1.2fr 0.8fr', gap: '30px' },
    card: { background: 'rgba(30, 41, 59, 0.4)', borderRadius: '24px', padding: '30px', border: '1px solid rgba(255, 255, 255, 0.08)' },
    cardHeader: { marginBottom: '20px' },
    cardTitle: { color: '#fff', margin: 0 },
    form: { display: 'flex', flexDirection: 'column', gap: '15px' },
    inputGroup: { display: 'flex', flexDirection: 'column', gap: '5px' },
    label: { fontSize: '11px', color: '#94a3b8', fontWeight: '800' },
    input: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', outline: 'none' },
    select: { padding: '12px', borderRadius: '10px', border: '1px solid rgba(255,255,255,0.1)', background: '#1e293b', color: '#fff', flex: 1 },
    row: { display: 'flex', gap: '15px' },
    uploadBox: { border: '2px dashed rgba(255,255,255,0.1)', padding: '20px', textAlign: 'center', borderRadius: '15px' },
    fileLabel: { color: '#3b82f6', cursor: 'pointer', fontSize: '14px' },
    previewImg: { width: '60px', marginTop: '10px', borderRadius: '8px' },
    primaryBtn: { background: '#3b82f6', color: '#fff', border: 'none', padding: '14px', borderRadius: '12px', fontWeight: '800' },
    outlineBtn: { background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '0 15px', borderRadius: '10px' },
    orderViewport: { height: '400px', overflowY: 'auto' },
    orderItem: { display: 'flex', justifyContent: 'space-between', padding: '15px', background: 'rgba(255,255,255,0.03)', borderRadius: '12px', marginBottom: '10px' },
    priceTag: { background: '#10b981', padding: '4px 10px', borderRadius: '8px', fontSize: '13px', fontWeight: '800' },
    table: { width: '100%', borderCollapse: 'collapse' },
    th: { textAlign: 'left', padding: '15px 25px', color: '#94a3b8', fontSize: '11px', textTransform: 'uppercase' },
    td: { padding: '15px 25px', color: '#f8fafc', fontSize: '14px', borderBottom: '1px solid rgba(255, 255, 255, 0.05)' },
    categoryPill: { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '3px 8px', borderRadius: '12px', fontSize: '11px' },
    descriptionTruncate: { maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', color: '#94a3b8' },
    editBtn: { background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' },
    saveBtn: { background: '#10b981', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' },
    cancelBtn: { background: 'rgba(255,255,255,0.1)', color: '#fff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' },
    deleteBtn: { background: 'rgba(239, 68, 68, 0.1)', color: '#ef4444', border: 'none', padding: '6px 12px', borderRadius: '8px', fontWeight: '700' }
};

export default AdminPortal;