import React from 'react';
// Ajustei o caminho do import para garantir que ele ache o contexto
import { useCart } from './CartContext'; 

const PaginaSucesso = () => {
  // Pegamos o clearCart aqui
  const { cart, totalValue, clearCart } = useCart();

  const enviarWhatsApp = () => {
    const numeroCarla = "5547989038296"; 
    
    let texto = `*Novo Pedido - Doce Afeto* 🍪\n\n`;
    cart.forEach(item => {
      texto += `• ${item.quantity}x ${item.title}\n`;
    });
    texto += `\n*Total:* R$ ${totalValue.toFixed(2)}`;
    texto += `\n*Status:* Pagamento Confirmado ✅`;

    const link = `https://wa.me/${numeroCarla}?text=${encodeURIComponent(texto)}`;
    
    // 1. Abre o WhatsApp
    window.open(link, "_blank");

    // 2. LIMPA O CARRINHO
    clearCart();

    // 3. VOLTA PARA A HOME
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