import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ArrowLeft, ShoppingCart } from "lucide-react";
// Importamos o hook do seu contexto de carrinho
import { useCart } from "./CartContext";

export default function CatalogoProdutos() {
  const [products, setProducts] = useState([]);
  // Pegamos a função addToCart do seu contexto global
  const { addToCart } = useCart();

  useEffect(() => {
    async function getProducts() {
      const { data, error } = await supabase.from('products').select('*');
      if (error) {
        console.error("Erro ao buscar produtos:", error);
      } else if (data) {
        setProducts(data);
      }
    }
    getProducts();
  }, []);

  return (
    <div className="catalog-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#8D6E63' }}>
          <ArrowLeft />
        </a>
        <h1 style={{ color: '#5D4037', fontFamily: 'serif', margin: 0 }}>
          Todas as Nossas Bolachas
        </h1>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))', 
        gap: '20px' 
      }}>
        {products.map(item => (
          <div 
            key={item.id} 
            className="product-card-detalhe" 
            style={{ 
              background: '#FFF', 
              padding: '15px', 
              borderRadius: '12px', 
              textAlign: 'center', 
              boxShadow: '0 4px 6px rgba(0,0,0,0.05)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <img 
                src={item.image} 
                alt={item.title} 
                style={{ width: '100%', borderRadius: '8px', height: '200px', objectFit: 'cover' }} 
              />
              <h3 style={{ margin: '15px 0 5px', color: '#5D4037' }}>{item.title}</h3>
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px' }}>{item.desc}</p>
              <p style={{ fontWeight: 'bold', color: '#c89b5a', fontSize: '18px' }}>{item.price}</p>
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: '15px',
                padding: '10px',
                backgroundColor: '#8D6E63',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                transition: 'background 0.2s'
              }}
              // Usamos a mesma lógica de ID do seu App.js (prefixo 'p-')
              onClick={() => addToCart({ ...item, id: "p-" + item.id })}
              onMouseOver={(e) => e.currentTarget.style.backgroundColor = '#5D4037'}
              onMouseOut={(e) => e.currentTarget.style.backgroundColor = '#8D6E63'}
            >
              <ShoppingCart size={18} /> 
              <span>Adicionar</span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}