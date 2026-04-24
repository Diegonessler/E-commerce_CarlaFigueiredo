import React, { useEffect, useState } from 'react';
import { useCart } from '../context/CartContext';

const PaginaSucesso = () => {
  const { cart, totalValue } = useCart();
  const [pedidoEnviado, setPedidoEnviado] = useState(false);

  // Função para montar a mensagem
  const gerarLinkWhatsApp = () => {
    const numeroCarla = "5547989038296"; // COLOQUE O NÚMERO REAL AQUI
    
    let texto = `*Novo Pedido - Doce Afeto* 🍪\n\n`;
    cart.forEach(item => {
      texto += `• ${item.quantity}x ${item.title}\n`;
    });
    texto += `\n*Total:* R$ ${totalValue.toFixed(2)}`;
    texto += `\n*Status:* Pagamento Confirmado ✅`;

    return `https://wa.me/${numeroCarla}?text=${encodeURIComponent(texto)}`;
  };

  return (
    <div style={{ textAlign: 'center', marginTop: '50px', fontFamily: 'sans-serif' }}>
      <h1 style={{ color: '#4CAF50' }}>Pagamento Aprovado! 🎉</h1>
      <p>Obrigado pelo seu pedido na Doce Afeto.</p>
      
      {cart.length > 0 ? (
        <div style={{ marginTop: '30px' }}>
          <p>Clique abaixo para enviar os detalhes pelo WhatsApp:</p>
          <a 
            href={gerarLinkWhatsApp()}
            target="_blank"
            rel="noopener noreferrer"
            style={{
              backgroundColor: '#25D366',
              color: 'white',
              padding: '15px 25px',
              textDecoration: 'none',
              borderRadius: '8px',
              fontWeight: 'bold',
              display: 'inline-block'
            }}
          >
            ENVIAR PEDIDO VIA WHATSAPP
          </a>
        </div>
      ) : (
        <p>Seu carrinho parece estar vazio. Se o pagamento foi feito, não se preocupe, a Carla já recebeu a confirmação!</p>
      )}
    </div>
  );
};

export default PaginaSucesso;