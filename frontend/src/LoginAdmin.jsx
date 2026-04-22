import React, { useState } from "react";
import { supabase } from "./supabaseClient";
// REMOVIDO: import { useNavigate } from "react-router-dom";
import "./Admin.css"; 

export default function LoginAdmin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleLogin(e) {
    e.preventDefault();
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      alert("Erro ao entrar: " + error.message);
    } else {
      // TROCADO: navigate("/admin") por redirecionamento nativo
      window.location.pathname = "/admin"; 
    }
    setLoading(false);
  }

  return (
    <div className="admin-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
      <div className="admin-card" style={{ width: '100%', maxWidth: '400px' }}>
        <h2 className="card-title">Acesso Restrito</h2>
        <form onSubmit={handleLogin} className="admin-form">
          <input 
            type="email" 
            placeholder="E-mail do administrador" 
            className="admin-input"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input 
            type="password" 
            placeholder="Senha" 
            className="admin-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Verificando..." : "Entrar no Painel"}
          </button>
        </form>
        <div style={{ marginTop: '15px', textAlign: 'center' }}>
           <a href="/" style={{ color: '#8D6E63', fontSize: '14px', textDecoration: 'none' }}>← Voltar para a loja</a>
        </div>
      </div>
    </div>
  );
}