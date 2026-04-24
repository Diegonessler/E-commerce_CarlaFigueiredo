import React, { useState, useEffect } from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import AdminPanel from './Admin.jsx'
import LoginAdmin from './LoginAdmin.jsx'
import CatalogoProdutos from './CatalogoProdutos.jsx'
import CatalogoKits from './CatalogoKits.jsx'
import Carrinho from './Carrinho.jsx'
import Sucesso from './Sucesso.jsx' // <--- IMPORTANTE: Importe a nova página
import { CartProvider } from './CartContext'
import { supabase } from './supabaseClient'
import './index.css'

function Router() {
  const [path, setPath] = useState(window.location.pathname);
  const [loading, setLoading] = useState(true);
  const [session, setSession] = useState(null);

  useEffect(() => {
    const handleLocationChange = () => {
      setPath(window.location.pathname);
    };

    window.addEventListener('popstate', handleLocationChange);

    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
    });

    return () => {
      window.removeEventListener('popstate', handleLocationChange);
      subscription.unsubscribe();
    };
  }, []);

  if (loading) return <div style={{ padding: '20px', textAlign: 'center' }}>Carregando...</div>;

  // --- Lógica de Roteamento ---
  
  // Login e Admin
  if (path === '/admin') {
    if (!session) {
      window.location.href = '/login-admin';
      return null;
    }
    return <AdminPanel />;
  }

  if (path === '/login-admin') {
    if (session) {
      window.location.href = '/admin';
      return null;
    }
    return <LoginAdmin />;
  }

  // Páginas da Loja
  if (path === '/todos-produtos') return <CatalogoProdutos />;
  if (path === '/todos-kits')     return <CatalogoKits />;
  if (path === '/carrinho')       return <Carrinho />;
  
  // --- NOVA ROTA ADICIONADA AQUI ---
  if (path === '/sucesso')        return <Sucesso />; 

  // Home
  return <App />;
}

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <CartProvider>
      <Router />
    </CartProvider>
  </React.StrictMode>,
)