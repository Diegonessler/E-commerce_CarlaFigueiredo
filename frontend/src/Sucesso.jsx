import React from 'react';
// Ajustei o caminho do import para garantir que ele ache o contexto
import { useCart } from './CartContext'; 

const PaginaSucesso = () => {
  // Pegamos o clearCart aqui
  const { cart, totalValue, clearCart } = useCart();

  const enviarWhatsApp = () => {
    const numeroCarla = "5547989038296"; 
    
    // Pega o ID do pagamento da URL (opcional)
    const urlParams = new URLSearchParams(window.location.search);
    const paymentId = urlParams.get('payment_id');

    let texto = `*NOVO PEDIDO - DOCE AFETO* 🍪\n`;
    texto += `--------------------------------\n\n`;
    
    texto += `*DETALHES DO PEDIDO:*\n`;
    cart.forEach(item => {
      texto += `✅ ${item.quantity}x ${item.title}\n`;
    });
    
    texto += `\n*VALOR TOTAL:* R$ ${totalValue.toFixed(2)}\n`;
    texto += `*STATUS:* Pagamento Confirmado ✅\n`;
    
    if (paymentId) {
      texto += `*ID DA TRANSACÃO:* ${paymentId}\n`;
    }

    texto += `\n--------------------------------\n`;
    texto += `*DADOS PARA ENTREGA:*\n`;
    texto += `_Por favor, informe abaixo se prefere retirar ou o endereço para entrega:_ \n\n`;
    texto += `📍 Endereço: \n`;
    texto += `🕒 Horário pretendido: \n`;

    const link = `https://wa.me/${numeroCarla}?text=${encodeURIComponent(texto)}`;
    
    window.open(link, "_blank");
    clearCart();
    window.location.href = "/";
  };

  return (
    <div style={{ textAlign: 'center', padding: '100px 20px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#4CAF50', fontSize: '2.5rem' }}>Pagamento Aprovado! 🎉</h1>
      <p style={{ fontSize: '1.2rem', color: '#666' }}>Obrigado pelo seu pedido na Doce Afeto.</p>
      
      {cart.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <p>Quase lá! Clique no botão abaixo para avisar a Carla no WhatsApp:</p>
          <button 
            onClick={enviarWhatsApp}
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              padding: '18px 30px',
              border: 'none',
              borderRadius: '50px',
              fontWeight: 'bold',
              fontSize: '1.1rem',
              cursor: 'pointer',
              boxShadow: '0 4px 15px rgba(0,0,0,0.1)',
              transition: 'transform 0.2s'
            }}
            onMouseOver={(e) => e.target.style.transform = 'scale(1.05)'}
            onMouseOut={(e) => e.target.style.transform = 'scale(1)'}
          >
            ENVIAR PEDIDO VIA WHATSAPP
          </button>
        </div>
      ) : (
        <div style={{ marginTop: '30px' }}>
          <p>Seu pedido já foi processado!</p>
          <button onClick={() => window.location.href = "/"} className="outline-button">
            Voltar para a Loja
          </button>
        </div>
      )}
    </div>
  );
};

export default PaginaSucesso;