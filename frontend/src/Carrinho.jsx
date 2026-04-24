import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, Trash2, Plus, Minus, Truck, Store } from 'lucide-react';

export default function Carrinho() {
  const { cart, removeFromCart, totalValue, updateQuantity } = useCart();
  const [cliente, setCliente] = useState({ 
    nome: '', 
    endereco: '', 
    horario: '', 
    tipoEntrega: 'entrega' // 'entrega' ou 'retirada'
  });
  const [enviando, setEnviando] = useState(false);

  const finalizarPedido = async () => {
    // Validação lógica: se for entrega, endereço é obrigatório. Se for retirada, não.
    if (!cliente.nome || (cliente.tipoEntrega === 'entrega' && !cliente.endereco)) {
      alert("Por favor, preencha seu nome e as informações de entrega!");
      return;
    }
    
    setEnviando(true);

    try {
      const res = await fetch('/.netlify/functions/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, cliente, total: totalValue }),
      });

      const data = await res.json();

      if (data.init_point) {
        // Salva os dados para a página de sucesso ler depois
        const enderecoFinal = cliente.tipoEntrega === 'retirada' ? 'RETIRADA NO LOCAL' : cliente.endereco;
        
        localStorage.setItem('dados_cliente', JSON.stringify({
          nome: cliente.nome,
          endereco: enderecoFinal,
          horario: cliente.horario || 'A combinar'
        }));

        // Redireciona para o Mercado Pago
        window.location.href = data.init_point;
      }
    } catch (err) {
      console.error("Erro:", err);
      alert("Houve um erro ao conectar com o Mercado Pago. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={containerStyle}>
      <header style={{ display: 'flex', alignItems: 'center', marginBottom: '40px' }}>
        <button onClick={() => window.history.back()} style={btnBackStyle}>
          <ArrowLeft size={28} color="#8D6E63" />
        </button>
        <h2 style={{ color: '#5D4037', margin: 0, marginLeft: '10px', fontSize: '24px' }}>Voltar a Loja</h2>
      </header>

      <div style={mainGridStyle}>
        
        {/* COLUNA ESQUERDA: LISTA DE PRODUTOS */}
        <div style={cardPedidoStyle}>
          <h3 style={titleStyle}>Seu Pedido</h3>
          <div style={{ borderBottom: '2px solid #8D6E63', marginBottom: '20px' }} />
          
          {cart.length === 0 ? (
            <p style={{ textAlign: 'center', color: '#8D6E63' }}>Seu carrinho está vazio.</p>
          ) : (
            cart.map(item => (
              <div key={item.id} style={itemRowStyle}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#5D4037' }}>{item.title}</div>
                  <div style={{ color: '#8D6E63' }}>{item.price}</div>
                </div>

                <div style={qtyControlsStyle}>
                  <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={btnQtySmall}><Minus size={14}/></button>
                  <span style={{ fontWeight: 'bold', width: '25px', textAlign: 'center', color: '#5D4037' }}>{item.quantity}</span>
                  <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={btnQtySmall}><Plus size={14}/></button>
                </div>

                <button onClick={() => removeFromCart(item.id)} style={btnTrash}><Trash2 size={20}/></button>
              </div>
            ))
          )}

          <div style={{ textAlign: 'right', marginTop: '30px' }}>
            <p style={{ margin: 0, color: '#8D6E63' }}>Total do Pedido:</p>
            <h2 style={{ margin: 0, fontSize: '32px', color: '#5D4037' }}>R$ {totalValue.toFixed(2)}</h2>
          </div>
        </div>

        {/* COLUNA DIREITA: DADOS E ENTREGA */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <section>
            <h3 style={labelHeaderStyle}>Seus Dados</h3>
            
            <input 
              type="text" 
              placeholder="Seu Nome Completo" 
              style={darkInputStyle} 
              value={cliente.nome}
              onChange={e => setCliente({...cliente, nome: e.target.value})}
            />

            {/* SELETOR DE ENTREGA OU RETIRADA */}
            <div style={toggleContainerStyle}>
              <button 
                onClick={() => setCliente({...cliente, tipoEntrega: 'entrega'})}
                style={{
                  ...toggleButtonStyle,
                  backgroundColor: cliente.tipoEntrega === 'entrega' ? '#8D6E63' : '#E0C9B0',
                  color: '#FFF'
                }}
              >
                <Truck size={18} /> Entrega
              </button>
              <button 
                onClick={() => setCliente({...cliente, tipoEntrega: 'retirada'})}
                style={{
                  ...toggleButtonStyle,
                  backgroundColor: cliente.tipoEntrega === 'retirada' ? '#8D6E63' : '#E0C9B0',
                  color: '#FFF'
                }}
              >
                <Store size={18} /> Vou Buscar
              </button>
            </div>

            {/* CAMPOS CONDICIONAIS */}
            {cliente.tipoEntrega === 'entrega' ? (
              <textarea 
                placeholder="Endereço Completo (Rua, Número, Bairro)" 
                style={{ ...darkInputStyle, minHeight: '100px', marginTop: '10px' }}
                value={cliente.endereco}
                onChange={e => setCliente({...cliente, endereco: e.target.value})}
              />
            ) : (
              <div style={avisoRetiradaStyle}>
                📍 <strong>Retirada:</strong> O endereço para busca será confirmado pela Carla após o pagamento.
              </div>
            )}

            <input 
              type="text" 
              placeholder={cliente.tipoEntrega === 'entrega' ? "Horário para entrega" : "Horário que virá retirar"} 
              style={{ ...darkInputStyle, marginTop: '10px' }} 
              value={cliente.horario}
              onChange={e => setCliente({...cliente, horario: e.target.value})}
            />
          </section>

          <section style={infoPagamentoStyle}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Pagamento via <strong>Mercado Pago</strong> (Pix ou Cartão).
            </p>
          </section>

          <button 
            onClick={finalizarPedido}
            disabled={enviando || cart.length === 0}
            style={{ ...btnFinalizarStyle, opacity: (enviando || cart.length === 0) ? 0.6 : 1 }}
          >
            {enviando ? 'PROCESSANDO...' : 'PAGAR E FINALIZAR'}
          </button>
        </div>
      </div>
    </div>
  );
}

// ESTILOS
const containerStyle = { backgroundColor: '#F5E6D3', minHeight: '100vh', padding: '40px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif' };
const mainGridStyle = { display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '40px', maxWidth: '1100px', margin: '0 auto' };
const cardPedidoStyle = { backgroundColor: '#FFF9F0', padding: '30px', borderRadius: '20px', boxShadow: '0 4px 15px rgba(0,0,0,0.05)', alignSelf: 'start' };
const darkInputStyle = { width: '100%', backgroundColor: '#2D2D2D', color: '#FFF', border: 'none', padding: '15px', borderRadius: '10px', fontSize: '16px', boxSizing: 'border-box' };
const infoPagamentoStyle = { backgroundColor: '#FFF', padding: '15px', borderRadius: '12px', border: '1px solid #E0C9B0', color: '#5D4037', textAlign: 'center' };
const btnFinalizarStyle = { backgroundColor: '#34D399', color: '#FFF', padding: '20px', borderRadius: '15px', border: 'none', fontSize: '18px', fontWeight: 'bold', cursor: 'pointer', boxShadow: '0 4px 10px rgba(52, 211, 153, 0.3)' };
const titleStyle = { textAlign: 'center', fontSize: '24px', color: '#5D4037', marginBottom: '10px' };
const labelHeaderStyle = { color: '#5D4037', fontSize: '22px', marginBottom: '15px', textAlign: 'center' };
const btnBackStyle = { background: 'none', border: 'none', cursor: 'pointer' };
const itemRowStyle = { display: 'flex', alignItems: 'center', padding: '15px 0', borderBottom: '1px solid #EEE' };
const btnQtySmall = { backgroundColor: '#8D6E63', color: '#FFF', border: 'none', borderRadius: '5px', width: '25px', height: '25px', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center' };
const qtyControlsStyle = { display: 'flex', alignItems: 'center', gap: '10px', margin: '0 15px' };
const btnTrash = { color: '#EF4444', background: 'none', border: 'none', cursor: 'pointer' };
const toggleContainerStyle = { display: 'flex', gap: '10px', marginTop: '15px' };
const toggleButtonStyle = { flex: 1, padding: '12px', borderRadius: '10px', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px', fontWeight: 'bold', transition: '0.3s' };
const avisoRetiradaStyle = { marginTop: '10px', padding: '15px', backgroundColor: '#E0C9B0', borderRadius: '10px', color: '#5D4037', fontSize: '14px', lineHeight: '1.4' };