const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.handler = async (event) => {
  // Habilita CORS
  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204 };
  }

  try {
    const { cart, cliente } = JSON.parse(event.body);

    if (!cart || cart.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Carrinho vazio" }) };
    }

    const preference = new Preference(client);

    // Mapeamento com limpeza rigorosa de preços
    const itemsMP = cart.map(item => {
      // Limpeza completa: remove R$, pontos de milhar e troca vírgula por ponto
      const rawPrice = String(item.price);
      const cleanPrice = rawPrice
        .replace('R$', '')
        .replace(/\./g, '')
        .replace(',', '.')
        .trim();
      
      const unitPrice = parseFloat(cleanPrice);

      return {
        id: String(item.id),
        title: item.title,
        unit_price: Number(unitPrice.toFixed(2)),
        quantity: Number(item.quantity),
        currency_id: 'BRL'
      };
    });

    const body = {
      items: itemsMP,
      back_urls: {
        success: "https://carlafigueiredo.shop/sucesso",
        failure: "https://carlafigueiredo.shop/carrinho",
        pending: "https://carlafigueiredo.shop/sucesso"
      },
      auto_return: 'approved',
      metadata: {
        cliente_nome: cliente?.nome || 'Não informado',
        endereco: cliente?.endereco || 'Não informado'
      }
    };

    const result = await preference.create({ body });

    return {
      statusCode: 200,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ init_point: result.init_point })
    };
  } catch (error) {
    console.error("ERRO MERCADO PAGO:", error);
    return { 
      statusCode: 500, 
      body: JSON.stringify({ error: error.message }) 
    };
  }
};