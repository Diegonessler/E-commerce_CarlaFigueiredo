const dados = JSON.parse(localStorage.getItem('ultimo_pedido'));

// Dentro do seu return:
<button 
  onClick={() => window.open(dados.linkWhats, '_blank')}
  style={{ backgroundColor: '#25D366', color: '#fff', padding: '15px 25px', borderRadius: '10px', border: 'none', fontWeight: 'bold', cursor: 'pointer' }}
>
  ENVIAR PEDIDO PARA O WHATSAPP
</button>