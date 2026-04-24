const { MercadoPagoConfig, Payment } = require('mercadopago');
// Importe seu cliente do supabase aqui se for salvar o pedido
// const { createClient } = require('@supabase/supabase-client');

const client = new MercadoPagoConfig({ accessToken: process.env.MP_ACCESS_TOKEN });

exports.handler = async (event) => {
  const { query } = event;
  const topic = query.topic || query.type;

  if (topic === 'payment') {
    const paymentId = query.id || query['data.id'];
    
    try {
      const payment = new Payment(client);
      const data = await payment.get({ id: paymentId });

      if (data.status === 'approved') {
        console.log(`Pagamento ${paymentId} aprovado!`);
        // AQUI: Adicione a lógica para salvar no Supabase ou enviar e-mail
        // Ex: const { data, error } = await supabase.from('pedidos').update({ status: 'pago' }).eq('id_mp', paymentId)
      }
    } catch (error) {
      console.error('Erro no Webhook:', error);
    }
  }

  return { statusCode: 200, body: 'OK' };
};