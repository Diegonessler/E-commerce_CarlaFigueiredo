import React, { useState } from 'react';
import { useCart } from './CartContext';
import { ArrowLeft, Trash2, ShoppingBag, CreditCard, QrCode, Banknote } from 'lucide-react';
import { supabase } from './supabaseClient';

export default function Carrinho() {
  const { cart, removeFromCart, totalValue } = useCart();
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
        mensagem += `• ${item.title} x${item.quantity} - ${item.price}\n`;
      });
      mensagem += `\n*Total: R$ ${totalValue.toFixed(2)}*`;

      // 3. ABRIR WHATSAPP (Ajustado para evitar bloqueio de popup)
      const url = `https://wa.me/${numeroWhats}?text=${encodeURIComponent(mensagem)}`;
      window.location.href = url; // Usar href em vez de window.open evita o bloqueio de popup

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
        <div style={{ textAlign: 'center', padding: '50px' }}><p>Carrinho vazio.</p></div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: window.innerWidth > 768 ? '1fr 1fr' : '1fr', gap: '30px' }}>
          
          {/* LISTA DE ITENS */}
          <div style={{ background: '#FDF5E6', padding: '20px', borderRadius: '15px' }}>
            <h3>Seu Pedido</h3>
            {cart.map(item => (
              <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                <span>{item.title} (x{item.quantity})</span>
                <button onClick={() => removeFromCart(item.id)} style={{ border: 'none', background: 'none', color: 'red' }}><Trash2 size={16}/></button>
              </div>
            ))}
            <h3 style={{ textAlign: 'right' }}>Total: R$ {totalValue.toFixed(2)}</h3>
          </div>

          {/* FORMULÁRIO E PAGAMENTO */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '15px' }}>
            <input type="text" placeholder="Nome Completo" style={inputStyle} onChange={e => setCliente({...cliente, nome: e.target.value})} />
            <textarea placeholder="Endereço de Entrega" style={inputStyle} onChange={e => setCliente({...cliente, endereco: e.target.value})} />

            <h3 style={{ marginTop: '10px' }}>Forma de Pagamento</h3>
            <select 
              style={{ ...inputStyle, height: '50px', fontSize: '18px', fontWeight: 'bold', border: '2px solid #8D6E63' }} 
              onChange={e => setCliente({...cliente, pagamento: e.target.value})}
            >
              <option value="Pix">Pix (Ganhe desconto)</option>
              <option value="Cartão">Cartão de Crédito</option>
              <option value="Dinheiro">Dinheiro na Entrega</option>
            </select>

            {/* SEÇÃO DINÂMICA DE PAGAMENTO */}
            <div style={{ padding: '15px', background: '#f9f9f9', borderRadius: '10px', border: '1px dashed #ccc' }}>
              {cliente.pagamento === 'Pix' && (
                <div style={{ textAlign: 'center' }}>
                  <QrCode size={100} style={{ margin: '0 auto' }} />
                  <p>Escaneie o QR Code ou use a chave Pix: <strong>CNPJ 00.000.000/0001-00</strong></p>
                </div>
              )}

              {cliente.pagamento === 'Cartão' && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '10px', color: '#8D6E63' }}><CreditCard /> <span>Dados do Cartão:</span></div>
                  <input type="text" placeholder="Número do Cartão" style={inputStyle} onChange={e => setCartao({...cartao, numero: e.target.value})} />
                  <div style={{ display: 'flex', gap: '10px' }}>
                    <input type="text" placeholder="Validade (MM/AA)" style={inputStyle} />
                    <input type="text" placeholder="CVV" style={inputStyle} />
                  </div>
                </div>
              )}

              {cliente.pagamento === 'Dinheiro' && (
                <div style={{ textAlign: 'center' }}>
                  <Banknote size={40} />
                  <p>Pagamento será feito no ato da entrega.</p>
                </div>
              )}
            </div>

            <button 
              onClick={enviarWhatsApp} 
              disabled={enviando}
              style={{ backgroundColor: '#25D366', color: 'white', padding: '20px', border: 'none', borderRadius: '10px', fontWeight: 'bold', cursor: 'pointer' }}
            >
              {enviando ? 'PROCESSANDO...' : 'FINALIZAR E ENVIAR WHATSAPP'}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

const inputStyle = { padding: '12px', borderRadius: '8px', border: '1px solid #ccc', width: '100%' };