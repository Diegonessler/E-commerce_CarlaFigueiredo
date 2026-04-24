import React, { useEffect } from 'react';
import { useCart } from './CartContext';

const PaginaSucesso = () => {
  const { cart, totalValue, clearCart } = useCart();

  // Recupera os dados que salvamos lá no Carrinho
  const dadosCliente = JSON.parse(localStorage.getItem('dados_cliente') || "{}");

  const enviarWhatsApp = () => {
    const numeroCarla = "5547989038296"; 
    
    // Pega o ID do pagamento que o Mercado Pago envia na URL
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id') || "Não identificado";

    // --- MONTAGEM DA MENSAGEM PROFISSIONAL ---
    let texto = `*✨ NOVO PEDIDO CONFIRMADO ✨*\n`;
    texto += `*ID:* #${paymentId}\n`;
    texto += `*STATUS:* Pagamento Realizado ✅\n`;
    texto += `--------------------------------\n\n`;
    
    texto += `*👤 CLIENTE:* ${dadosCliente.nome || "Não informado"}\n\n`;

    texto += `*🍪 ITENS:* \n`;
    cart.forEach(item => {
      texto += `• ${item.quantity}x ${item.title}\n`;
    });
    
    texto += `\n*💰 TOTAL:* R$ ${totalValue.toFixed(2)}\n`;
    texto += `--------------------------------\n\n`;
    
    texto += `*🚚 ENTREGA / RETIRADA:* \n`;
    texto += `📍 ${dadosCliente.endereco || "Não informado"}\n`;
    texto += `🕒 ${dadosCliente.horario ? `Horário: ${dadosCliente.horario}` : "Horário: A combinar"}\n\n`;
    
    texto += `_Pedido gerado por carlafigueiredo.shop_`;

    const link = `https://wa.me/${numeroCarla}?text=${encodeURIComponent(texto)}`;
    
    // 1. Abre o WhatsApp com a mensagem pronta
    window.open(link, "_blank");

    // 2. Limpa o carrinho e os dados temporários do cliente
    localStorage.removeItem('dados_cliente');
    clearCart();

    // 3. Redireciona para a Home
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: 'center', padding: '80px 20px', fontFamily: '"Segoe UI", Roboto, sans-serif', backgroundColor: '#F5E6D3', minHeight: '100vh' }}>
      <div style={{ backgroundColor: '#FFF', padding: '40px', borderRadius: '20px', maxWidth: '500px', margin: '0 auto', boxShadow: '0 10px 25px rgba(0,0,0,0.1)' }}>
        <h1 style={{ color: '#4CAF50', fontSize: '2.5rem', marginBottom: '10px' }}>Sucesso! 🎉</h1>
        <p style={{ fontSize: '1.2rem', color: '#5D4037' }}>Seu pagamento foi aprovado.</p>
        
        <div style={{ margin: '30px 0', borderTop: '1px solid #EEE', paddingTop: '20px' }}>
          <p style={{ color: '#8D6E63', fontWeight: '500' }}>
            Agora, clique no botão abaixo para enviar os detalhes do pedido para o WhatsApp da Carla e combinar a entrega.
          </p>
        </div>

        <button 
          onClick={enviarWhatsApp}
          style={{
            backgroundColor: '#25D366',
            color: 'white',
            padding: '20px 30px',
            border: 'none',
            borderRadius: '50px',
            fontWeight: 'bold',
            fontSize: '1.1rem',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            width: '100%',
            boxShadow: '0 4px 15px rgba(37, 211, 102, 0.3)',
            transition: 'transform 0.2s'
          }}
          onMouseOver={(e) => e.target.style.transform = 'scale(1.02)'}
          onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
        >
          ✅ ENVIAR PEDIDO PARA O WHATSAPP
        </button>

        <p style={{ marginTop: '20px', fontSize: '12px', color: '#999' }}>
          ID do Pagamento: {new URLSearchParams(window.location.search).get('payment_id')}
        </p>
      </div>
    </div>
  );
};

export default PaginaSucesso;