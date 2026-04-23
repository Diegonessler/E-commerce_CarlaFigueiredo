import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ArrowLeft, ShoppingCart } from "lucide-react";
// Importamos o hook global do seu carrinho
import { useCart } from "./CartContext";

export default function CatalogoKits() {
  const [kits, setKits] = useState([]);
  // Pegamos a função de adicionar do contexto
  const { addToCart } = useCart();

  useEffect(() => {
    async function getKits() {
      // Buscando da tabela de kits conforme seu código original
      const { data, error } = await supabase.from('kits').select('*');
      if (error) {
        console.error("Erro ao buscar kits:", error);
      } else if (data) {
        setKits(data);
      }
    }
    getKits();
  }, []);

  return (
    <div className="catalog-container" style={{ padding: '20px', maxWidth: '1200px', margin: '0 auto' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <a href="/" style={{ color: '#8D6E63' }}>
          <ArrowLeft />
        </a>
        <h1 style={{ color: '#5D4037', fontFamily: 'serif', margin: 0 }}>
          Nossos Kits Especiais
        </h1>
      </header>

      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: '25px' 
      }}>
        {kits.map(item => (
          <div 
            key={item.id} 
            className="product-card-detalhe" 
            style={{ 
              background: '#FFF', 
              padding: '20px', 
              borderRadius: '15px', 
              textAlign: 'center', 
              boxShadow: '0 4px 10px rgba(0,0,0,0.08)',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'space-between'
            }}
          >
            <div>
              <img 
                src={item.image} 
                alt={item.title} 
                style={{ width: '100%', borderRadius: '10px', height: '220px', objectFit: 'cover' }} 
              />
              <h3 style={{ margin: '15px 0 8px', color: '#5D4037' }}>{item.title}</h3>
              {/* Alguns kits usam .description ou .desc, o operador || garante que apareça */}
              <p style={{ fontSize: '14px', color: '#666', marginBottom: '10px', lineHeight: '1.4' }}>
                {item.description || item.desc}
              </p>
              <p style={{ fontWeight: 'bold', color: '#c89b5a', fontSize: '20px', margin: '10px 0' }}>
                {item.price}
              </p>
            </div>

            <button 
              className="btn-primary" 
              style={{ 
                width: '100%', 
                marginTop: '15px',
                padding: '12px',
                backgroundColor: '#8D6E63',
                color: '#fff',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '10px',
                fontWeight: '600'
              }}
              // IMPORTANTE: id começando com "k-" para seguir a lógica do seu App.js
              onClick={() => addToCart({ ...item, id: "k-" + item.id })}
            >
              <ShoppingCart size={18} /> 
              Adicionar Kit
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}