const { MercadoPagoConfig, Preference } = require('mercadopago');

// Configure com seu Access Token (use variáveis de ambiente no Netlify!)
const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  try {
    const { cart, cliente } = JSON.parse(event.body);

    const preference = new Preference(client);

    const body = {
      items: cart.map(item => ({
        id: item.id,
        title: item.title,
        unit_price: Number(item.price),
        quantity: Number(item.quantity),
        currency_id: 'BRL'
      })),
      back_urls: {
        success: `${process.env.URL}/sucesso`,
        failure: `${process.env.URL}/carrinho`,
        pending: `${process.env.URL}/sucesso`
      },
      auto_return: 'approved',
      notification_url: `${process.env.URL}/.netlify/functions/webhook-mp`,
      metadata: {
        nome_cliente: cliente.nome,
        endereco: cliente.endereco
      }
    };

    const result = await preference.create({ body });

    return {
      statusCode: 200,
      body: JSON.stringify({ init_point: result.init_point })
    };
  } catch (error) {
    console.error(error);
    return { statusCode: 500, body: JSON.stringify({ error: error.message }) };
  }
};