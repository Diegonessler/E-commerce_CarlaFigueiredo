import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
// Adicionado Trash2 na importação
import { Package, ShoppingBag, ArrowLeft, PlusCircle, Edit3, Save, Tag, LogOut, Trash2 } from "lucide-react";
import "./Admin.css";

export default function AdminPanel() {
  const [tab, setTab] = useState("products");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  
  const [newItem, setNewItem] = useState({ title: "", desc: "", price: "", badge: "" });
  const [imageFile, setImageFile] = useState(null);
  
  const [editItem, setEditItem] = useState({ id: "", title: "", price: "", image: "", badge: "" });
  const [editImageFile, setEditImageFile] = useState(null);

  // PROTEÇÃO DE ROTA E CARREGAMENTO
  useEffect(() => {
    async function checkAuth() {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) {
        window.location.pathname = "/login-admin";
      } else {
        fetchItems();
      }
    }
    checkAuth();
    setEditItem({ id: "", title: "", price: "", image: "", badge: "" });
  }, [tab]);

  async function fetchItems() {
    setLoading(true);
    try {
      const { data, error } = await supabase.from(tab).select("*").order("id", { ascending: false });
      if (error) throw error;
      if (data) setItems(data);
    } catch (err) {
      console.error("Erro ao buscar:", err.message);
    } finally {
      setLoading(false);
    }
  }

  // FUNÇÃO DE EXCLUSÃO ADICIONADA
  async function handleDelete(id, title) {
    const confirmar = window.confirm(`Tem certeza que deseja excluir "${title}"?`);
    if (!confirmar) return;

    setLoading(true);
    try {
      const { error } = await supabase.from(tab).delete().eq('id', id);
      if (error) throw error;
      
      alert("Item removido com sucesso!");
      fetchItems(); // Recarrega a lista
      
      // Se o item deletado for o que estava sendo editado, limpa o form
      if (editItem.id === id) {
        setEditItem({ id: "", title: "", price: "", image: "", badge: "" });
      }
    } catch (err) {
      alert("Erro ao excluir: " + err.message);
    } finally {
      setLoading(false);
    }
  }

  async function handleLogout() {
    await supabase.auth.signOut();
    window.location.pathname = "/login-admin";
  }

  async function uploadImage(file) {
    const fileExt = file.name.split('.').pop();
    const fileName = `${Math.random()}.${fileExt}`;
    const { error: uploadError } = await supabase.storage
      .from('imagens-produtos')
      .upload(fileName, file);

    if (uploadError) throw uploadError;
    const { data } = supabase.storage.from('imagens-produtos').getPublicUrl(fileName);
    return data.publicUrl;
  }

  async function handleCreate(e) {
    e.preventDefault();
    if (!imageFile) return alert("Selecione uma imagem!");
    setLoading(true);
    try {
      const publicUrl = await uploadImage(imageFile);
      const dataToInsert = { 
        title: newItem.title,
        desc: newItem.desc,
        image: publicUrl, 
        price: `R$ ${newItem.price}` 
      };
      if (tab === "products") dataToInsert.badge = newItem.badge;

      const { error } = await supabase.from(tab).insert([dataToInsert]);
      if (error) throw error;
      
      alert("Cadastrado com sucesso!");
      setNewItem({ title: "", desc: "", price: "", badge: "" });
      setImageFile(null);
      fetchItems();
    } catch (err) { alert("Erro ao criar: " + err.message); }
    finally { setLoading(false); }
  }

  function carregarParaEditar(id) {
    if (!id) {
      setEditItem({ id: "", title: "", price: "", image: "", badge: "" });
      return;
    }
    const item = items.find(i => i.id === parseInt(id));
    if (item) {
      setEditItem({ 
        id: item.id, 
        title: item.title, 
        price: item.price.replace("R$ ", ""), 
        image: item.image,
        badge: item.badge || "" 
      });
    }
  }

  async function handleUpdate(e) {
    e.preventDefault();
    setLoading(true);
    try {
      let finalImageUrl = editItem.image;
      if (editImageFile) finalImageUrl = await uploadImage(editImageFile);

      const dataToUpdate = { 
        title: editItem.title, 
        price: `R$ ${editItem.price}`,
        image: finalImageUrl
      };
      if (tab === "products") dataToUpdate.badge = editItem.badge;

      const { error } = await supabase.from(tab).update(dataToUpdate).eq('id', editItem.id);
      if (error) throw error;
      
      alert("Item atualizado!");
      setEditItem({ id: "", title: "", price: "", image: "", badge: "" });
      setEditImageFile(null);
      fetchItems();
    } catch (err) { alert(err.message); }
    finally { setLoading(false); }
  }

  return (
    <div className="admin-container">
      <header className="admin-header">
        <div>
          <h2>Painel Administrativo</h2>
          <p>Gestão de {tab === "products" ? "Bolachas" : "Kits"}</p>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <a href="/" className="back-link"><ArrowLeft size={18} /> Loja</a>
          <button onClick={handleLogout} className="back-link" style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#d9534f' }}>
            <LogOut size={18} /> Sair
          </button>
        </div>
      </header>

      <div className="tab-container">
        <button onClick={() => setTab("products")} className={`tab-button ${tab === "products" ? "active" : "inactive"}`}>
          <ShoppingBag size={18} /> Bolachas
        </button>
        <button onClick={() => setTab("kits")} className={`tab-button ${tab === "kits" ? "active" : "inactive"}`}>
          <Package size={18} /> Kits
        </button>
      </div>

      <div className="admin-grid">
        {/* FORMULÁRIO DE CRIAÇÃO */}
        <div className="admin-card">
          <h3 className="card-title"><PlusCircle size={18} /> Novo Item</h3>
          <form onSubmit={handleCreate} className="admin-form">
            <input className="admin-input" type="text" placeholder="Nome" value={newItem.title} required onChange={e => setNewItem({...newItem, title: e.target.value})} />
            <input className="admin-input" type="text" placeholder="Preço (ex: 29,90)" value={newItem.price} required onChange={e => setNewItem({...newItem, price: e.target.value})} />
            {tab === "products" && (
              <input className="admin-input" type="text" placeholder="Selo (ex: Novo)" value={newItem.badge} onChange={e => setNewItem({...newItem, badge: e.target.value})} />
            )}
            <textarea className="admin-input" style={{height: '60px'}} placeholder="Descrição" value={newItem.desc} required onChange={e => setNewItem({...newItem, desc: e.target.value})} />
            <div className="upload-box">
              <input type="file" accept="image/*" onChange={e => setImageFile(e.target.files[0])} />
            </div>
            <button type="submit" disabled={loading} className="btn-primary">
              {loading ? "Carregando..." : "Cadastrar"}
            </button>
          </form>
        </div>

        {/* COLUNA DE EDIÇÃO E LISTAGEM */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
          <div className="admin-card" style={{border: '1px solid #c89b5a'}}>
            <h3 className="card-title"><Edit3 size={18} /> Editar Existente</h3>
            <form onSubmit={handleUpdate} className="admin-form">
              <select className="admin-input" value={editItem.id} onChange={e => carregarParaEditar(e.target.value)}>
                <option value="">Selecione para editar...</option>
                {items.map(i => <option key={i.id} value={i.id}>{i.title}</option>)}
              </select>

              {editItem.id && (
                <>
                  <input className="admin-input" type="text" value={editItem.title} onChange={e => setEditItem({...editItem, title: e.target.value})} />
                  <input className="admin-input" type="text" value={editItem.price} onChange={e => setEditItem({...editItem, price: e.target.value})} />
                  {tab === "products" && (
                    <div style={{ position: 'relative' }}>
                      <Tag size={16} style={{ position: 'absolute', right: '10px', top: '12px', color: '#c89b5a' }} />
                      <input className="admin-input" type="text" value={editItem.badge} onChange={e => setEditItem({...editItem, badge: e.target.value})} />
                    </div>
                  )}
                  <div className="item-row" style={{backgroundColor: '#FFFAF5', padding: '10px', borderRadius: '8px'}}>
                    <img src={editItem.image} className="mini-img" alt="" />
                    <input type="file" accept="image/*" onChange={e => setEditImageFile(e.target.files[0])} style={{fontSize: '11px'}} />
                  </div>
                  <button type="submit" disabled={loading} className="btn-primary" style={{backgroundColor: '#c89b5a'}}>
                    <Save size={18} /> {loading ? "Salvando..." : "Salvar Alterações"}
                  </button>
                </>
              )}
            </form>
          </div>

          <div className="admin-card">
            <h3 className="card-title">Itens Ativos ({items.length})</h3>
            <div style={{maxHeight: '250px', overflowY: 'auto'}}>
              {loading && items.length === 0 ? <p>Buscando itens...</p> : 
                items.map(item => (
                <div key={item.id} className="item-row" style={{justifyContent: 'space-between'}}>
                  <div style={{display: 'flex', gap: '10px', alignItems: 'center'}}>
                    <img src={item.image} className="mini-img" alt="" />
                    <div style={{fontSize: '13px'}}>
                      <strong>{item.title}</strong>
                      {item.badge && <span className="badge-preview">{item.badge}</span>}
                      <br/>{item.price}
                    </div>
                  </div>
                  
                  {/* BOTÃO DE EXCLUIR */}
                  <button 
                    onClick={() => handleDelete(item.id, item.title)}
                    className="btn-delete"
                    title="Excluir item"
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#ff4d4d', padding: '5px' }}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}