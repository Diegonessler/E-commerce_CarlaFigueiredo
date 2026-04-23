import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, Trash2, CreditCard, QrCode, Banknote, Plus, Minus } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Carrinho() {
  // Adicionado 'updateQuantity' vindo do contexto
  const { cart, removeFromCart, totalValue, updateQuantity } = useCart();
  
  const [cliente, setCliente] = useState({ nome: '', endereco: '', pagamento: 'Pix' });
  const [cartao, setCartao] = useState({ numero: '', cvv: '', validade: '' });
  const [enviando, setEnviando] = useState(false);

  const enviarWhatsApp = async () => {
    if (!cliente.nome || !cliente.endereco) {
      alert("Por favor, preencha seu nome e endereço.");
      return;
    }

    setEnviando(true);

    try {
      // 1. Salvar no Supabase
      const { error } = await supabase.from('orders').insert([
        {
          customer_name: cliente.nome,
          customer_whatsapp: cliente.endereco, 
          items: cart,
          total_price: `R$ ${totalValue.toFixed(2)}`,
          status: 'pendente'
        }
      ]);

      if (error) throw error;

      // 2. Montar Mensagem
      const numeroWhats = "5547989038296"; 
      let mensagem = `*Novo Pedido - Carla Figueiredo*\n`;
      mensagem += `-------------------------------\n`;
      mensagem += `*Cliente:* ${cliente.nome}\n`;
      mensagem += `*Endereço:* ${cliente.endereco}\n`;
      mensagem += `*Pagamento:* ${cliente.pagamento}\n`;
      
      if(cliente.pagamento === 'Cartão') {
        mensagem += `*(Pagamento via Cartão solicitado)*\n`;
      }

      mensagem += `-------------------------------\n\n`;
      mensagem += `*Itens:*\n`;
      cart.forEach(item => {
        // Cálculo de subtotal por item para clareza na mensagem
        const subtotalItem = (parseFloat(item.price.replace('R$', '').replace(',', '.')) * item.quantity).toFixed(2);
        mensagem += `• ${item.title} (${item.quantity}x) - R$ ${subtotalItem}\n`;
      });
      mensagem += `\n*Total: R$ ${totalValue.toFixed(2)}*`;

      const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
      window.location.href = url;

    } catch (error) {
      alert("Erro ao processar. Tente novamente.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div style={{ padding: '20px', maxWidth: '900px', margin: '0 auto', fontFamily: 'sans-serif', color: '#5D4037' }}>
      <header style={{ display: 'flex', alignItems: 'center', gap: '15px', marginBottom: '30px' }}>
        <button onClick={() => window.location.pathname = '/'} style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#8D6E63' }}>
          <ArrowLeft size={30} />
        </button>
        <h2 style={{ margin: 0 }}>Finalizar Pedido</h2>
      </header>

      {cart.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '50px' }}>
          <p>Seu carrinho está vazio.</p>
          <button onClick={() => window.location.pathname = '/'} style={{ color: '#8D6E63', textDecoration: 'underline', background: 'none', border: 'none', cursor: 'pointer' }}>Voltar para a loja</button>
        </div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1.2fr 0.8fr' : '1fr', gap: '30px' }}>
          
          {/* LISTA DE ITENS COM CONTROLE DE QUANTIDADE */}
          <div style={{ background: '#FDF5E6', padding: '20px', borderRadius: '15px', alignSelf: 'start' }}>
            <h3 style={{ borderBottom: '2px solid #8D6E63', paddingBottom: '10px' }}>Seu Pedido</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '15px 0', borderBottom: '1px solid #ddd' }}>
                <div style={{ flex: 1 }}>
                  <div style={{ fontWeight: 'bold' }}>{item.title}</div>
                  <div style={{ fontSize: '14px', color: '#8D6E63' }}>{item.price}</div>
                </div>

                {/* CONTROLES DE QUANTIDADE */}
                <div style={{ display: 'flex', alignItems: 'center', gap: '12px', margin: '0 20px' }}>
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    style={btnQtyStyle}
                    disabled={item.quantity <= 1}
                  >
                    <Minus size={14} />
                  </button>
                  
                  <span style={{ fontWeight: 'bold', minWidth: '20px', textAlign: 'center' }}>{item.quantity}</span>
                  
                  <button 
                    onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    style={btnQtyStyle}
                  >
                    <Plus size={14} />
                  </button>
                </div>

                <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: '#E57373', cursor: 'pointer' }}>
                  <Trash2 size={20}/>
                </button>
              </div>
            ))}
            <div style={{ textAlign: 'right', marginTop: '20px' }}>
              <span style={{ fontSize: '18px' }}>Total do Pedido:</span>
              <h2 style={{ margin: '5px 0', color: '#5D4037' }}>R$ {totalValue.toFixed(2)}</h2>
            </div>
          </div>

          {/* FORMULÁRIO E PAGAMENTO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
              <label style={{ fontWeight: 'bold' }}>Seus Dados</label>
              <input type="text" placeholder="Nome Completo" style={inputStyle} onChange={e => setCliente({...cliente, nome: e.target.value})} />
              <textarea placeholder="Endereço de Entrega (Rua, Número, Bairro)" style={{ ...inputStyle, minHeight: '80px' }} onChange={e => setCliente({...cliente, endereco: e.target.value})} />
            </div>

            <h3 style={{ marginTop: '10px', marginBottom: '5px' }}>Forma de Pagamento</h3>
            <select 
              style={{ ...inputStyle, height: '50px', fontSize: '16px', fontWeight: 'bold', border: '2px solid #8D6E63', cursor: 'pointer' }} 
              onChange={e => setCliente({...cliente, pagamento: e.target.value})}
            >
              <option value="Pix">Pix (Rápido e Seguro)</option>
              <option value="Cartão">Cartão de Crédito</option>
              <option value="Dinheiro">Dinheiro na Entrega</option>
            </select>

            <div style={{ padding: '15px', background: '#fff', borderRadius: '10px', border: '1px dashed #8D6E63' }}>
              {cliente.pagamento === 'Pix' && (
                <div style={{ textAlign: 'center' }}>
                  <QrCode size={100} style={{ margin: '0 auto', color: '#8D6E63' }} />
                  <p style={{ fontSize: '14px' }}>Chave Pix CNPJ:<br/><strong>00.000.000/0001-00</strong></p>
                </div>
              )}

              {cliente.pagamento === 'Cartão' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8D6E63', fontWeight: 'bold' }}><CreditCard size={18} /> Dados do Cartão</div>
                  <input type="text" placeholder="Número do Cartão" style={inputStyle} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Validade" style={inputStyle} />
                    <input type="text" placeholder="CVV" style={inputStyle} />
                  </div>
                </div>
              )}

              {cliente.pagamento === 'Dinheiro' && (
                <div style={{ textAlign: 'center', color: '#8D6E63' }}>
                  <Banknote size={40} style={{ margin: '0 auto' }} />
                  <p>Levar o dinheiro para o entregador no ato da entrega.</p>
                </div>
              )}
            </div>

            <button 
              onClick={enviarWhatsApp} 
              disabled={enviando}
              style={{ 
                backgroundColor: enviando ? '#ccc' : '#25D366', 
                color: 'white', 
                padding: '20px', 
                border: 'none', 
                borderRadius: '10px', 
                fontWeight: 'bold', 
                fontSize: '16px',
                cursor: enviando ? 'not-allowed' : 'pointer',
                transition: '0.3s'
              }}
            >
              {enviando ? 'PROCESSANDO...' : 'FINALIZAR E ENVIAR WHATSAPP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

// Estilos Reutilizáveis
const inputStyle = { 
  padding: '12px', 
  borderRadius: '8px', 
  border: '1px solid #ccc', 
  width: '100%',
  boxSizing: 'border-box' 
};

const btnQtyStyle = {
  backgroundColor: '#8D6E63',
  color: 'white',
  border: 'none',
  borderRadius: '6px',
  width: '28px',
  height: '28px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  cursor: 'pointer',
  transition: '0.2s'
};