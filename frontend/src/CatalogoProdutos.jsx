import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ArrowLeft, ShoppingCart } from "lucide-react";

export default function CatalogoProdutos() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    async function getProducts() {
      const { data } = await supabase.from('products').select('*');
      if (data) setProducts(data);
    }
    getProducts();
  }, []);

  return (
    <div className="catalog-container" style={{ padding: '20px' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#8D6E63' }}><ArrowLeft /></a>
        <h1 style={{ color: '#5D4037', fontFamily: 'serif' }}>Todas as Nossas Bolachas</h1>
      </header>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', gap: '20px' }}>
        {products.map(item => (
          <div key={item.id} className="product-card-detalhe" style={{ background: '#FFF', padding: '15px', borderRadius: '12px', textAlign: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.05)' }}>
            <img src={item.image} alt={item.title} style={{ width: '100%', borderRadius: '8px', height: '200px', objectFit: 'cover' }} />
            <h3 style={{ margin: '15px 0 5px' }}>{item.title}</h3>
            <p style={{ fontSize: '14px', color: '#666' }}>{item.desc}</p>
            <p style={{ fontWeight: 'bold', color: '#c89b5a', fontSize: '18px' }}>{item.price}</p>
            <button className="btn-primary" style={{ width: '100%', marginTop: '10px' }}>
              <ShoppingCart size={18} /> Adicionar
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}