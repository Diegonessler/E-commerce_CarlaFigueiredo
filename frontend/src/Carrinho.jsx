import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, Trash2, Plus, Minus } from 'lucide-react';

export default function Carrinho() {
  const { cart, removeFromCart, totalValue, updateQuantity } = useCart();
  const [cliente, setCliente] = useState({ nome: '', endereco: '', metodo: 'cartao' });
  const [enviando, setEnviando] = useState(false);

  // Função para gerar mensagem do WhatsApp
  const gerarMensagemWhats = () => {
    const itens = cart.map(i => `- ${i.quantity}x ${i.title}`).join('%0A');
    const texto = `Olá! Acabei de fazer um pedido na Doce Afeto:%0A%0A*Itens:*%0A${itens}%0A%0A*Total:* R$ ${totalValue.toFixed(2)}%0A*Cliente:* ${cliente.nome}%0A*Entrega:* ${cliente.endereco}%0A*Pagamento:* Mercado Pago (Cartão/Pix)`;
    return `https://wa.me/5547999999999?text=${texto}`; // <--- COLOQUE SEU NÚMERO AQUI
  };

  const finalizarPedido = async () => {
    if (!cliente.nome || !cliente.endereco) {
      alert("Por favor, preencha seu nome e endereço para a entrega!");
      return;
    }
    setEnviando(true);

    try {
      // 1. Envia para sua Netlify Function
      const res = await fetch('/.netlify/functions/criar-preferencia', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ cart, cliente, total: totalValue }),
      });

      const data = await res.json();

      if (data.init_point) {
        // 2. Salva os dados no localStorage para a página de sucesso ler e mandar o Whats
        localStorage.setItem('ultimo_pedido', JSON.stringify({
          cliente: cliente.nome,
          linkWhats: gerarMensagemWhats()
        }));

        // 3. Redireciona para o Checkout Profissional (Lá ele escolhe Pix ou Cartão)
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
        <h2 style={{ color: '#FDF5E6', margin: 0, marginLeft: '10px', fontSize: '24px' }}>Finalizar Pedido</h2>
      </header>

      <div style={mainGridStyle}>
        
        {/* COLUNA ESQUERDA: PEDIDO */}
        <div style={cardPedidoStyle}>
          <h3 style={titleStyle}>Seu Pedido</h3>
          <div style={{ borderBottom: '2px solid #8D6E63', marginBottom: '20px' }} />
          
          {cart.map(item => (
            <div key={item.id} style={itemRowStyle}>
              <div style={{ flex: 1 }}>
                <div style={{ fontWeight: 'bold', fontSize: '18px', color: '#5D4037' }}>{item.title}</div>
                <div style={{ color: '#8D6E63' }}>R$ {item.price}</div>
              </div>

              <div style={qtyControlsStyle}>
                <button onClick={() => updateQuantity(item.id, item.quantity - 1)} style={btnQtySmall}><Minus size={14}/></button>
                <span style={{ fontWeight: 'bold', width: '25px', textAlign: 'center', color: '#5D4037' }}>{item.quantity}</span>
                <button onClick={() => updateQuantity(item.id, item.quantity + 1)} style={btnQtySmall}><Plus size={14}/></button>
              </div>

              <button onClick={() => removeFromCart(item.id)} style={btnTrash}><Trash2 size={20}/></button>
            </div>
          ))}

          <div style={{ textAlign: 'right', marginTop: '30px' }}>
            <p style={{ margin: 0, color: '#8D6E63' }}>Total do Pedido:</p>
            <h2 style={{ margin: 0, fontSize: '32px', color: '#5D4037' }}>R$ {totalValue.toFixed(2)}</h2>
          </div>
        </div>

        {/* COLUNA DIREITA: DADOS */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '25px' }}>
          
          <section>
            <h3 style={labelHeaderStyle}>Seus Dados</h3>
            <input 
              type="text" 
              placeholder="Nome Completo" 
              style={darkInputStyle} 
              onChange={e => setCliente({...cliente, nome: e.target.value})}
            />
            <textarea 
              placeholder="Endereço de Entrega (Rua, Número, Bairro)" 
              style={{ ...darkInputStyle, minHeight: '100px', marginTop: '10px' }}
              onChange={e => setCliente({...cliente, endereco: e.target.value})}
            />
          </section>

          <section style={infoPagamentoStyle}>
            <p style={{ margin: 0, fontSize: '14px' }}>
              Você será redirecionado para o <strong>Mercado Pago</strong> para finalizar com Cartão ou Pix de forma segura.
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

// ESTILOS MANTIDOS E OTIMIZADOS
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