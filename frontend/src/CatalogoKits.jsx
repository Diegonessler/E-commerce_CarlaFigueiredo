import React, { useState, useEffect } from "react";
import { supabase } from "./supabaseClient";
import { ArrowLeft, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";


export default function CatalogoKits() {
  const [kits, setKits] = useState([]);
  const [loading, setLoading] = useState(true);
  const { addToCart } = useCart();

  useEffect(() => {
    async function getKits() {
      const { data, error } = await supabase.from("kits").select("*");
      if (error) {
        console.error("Erro ao buscar kits:", error);
      } else if (data) {
        setKits(data);
      }
      setLoading(false);
    }
    getKits();
  }, []);

  return (
    <div className="catalog-page">
      <div className="catalog-container">

        <header className="catalog-header">
          <a href="/" className="catalog-back-btn" aria-label="Voltar">
            <ArrowLeft size={20} />
          </a>
          <h1>
            Kits Especiais
            <span>para presentear com amor</span>
          </h1>
        </header>

        <div className="catalog-grid">
          {loading && (
            <p className="catalog-loading">Carregando kits... 🎁</p>
          )}

          {!loading && kits.length === 0 && (
            <p className="catalog-empty">Nenhum kit cadastrado ainda.</p>
          )}

          {kits.map((item) => (
            <div key={item.id} className="catalog-card">
              <img
                src={item.image}
                alt={item.title}
                className="catalog-card-img"
              />
              <div className="catalog-card-body">
                <h3>{item.title}</h3>
                <p className="desc">{item.description || item.desc}</p>
                <p className="price">{item.price}</p>
                <button
                  className="catalog-add-btn"
                  onClick={() => addToCart({ ...item, id: "k-" + item.id })}
                >
                  <ShoppingCart size={17} />
                  Adicionar Kit
                </button>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
  );
}