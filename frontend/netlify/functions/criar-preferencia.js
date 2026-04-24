const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.handler = async (event) => {
  // Tratamento de CORS para evitar erros de bloqueio no navegador
  if (event.httpMethod === 'OPTIONS') {
    return { 
      statusCode: 200, 
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type",
        "Access-Control-Allow-Methods": "POST, OPTIONS"
      }
    };
  }

  try {
    const { cart } = JSON.parse(event.body);

    if (!cart || cart.length === 0) {
      return { statusCode: 400, body: JSON.stringify({ error: "Carrinho vazio" }) };
    }

    const preference = new Preference(client);

    // LIMPEZA TOTAL DOS ITENS
    const itemsParaMP = cart.map(item => {
      // 1. Transforma o preço em string
      let priceStr = String(item.price);
      
      // 2. Remove TUDO que não for número, vírgula ou ponto
      // Isso tira "R$", espaços, letras, etc.
      let priceClean = priceStr.replace(/[^\d,.]/g, '');

      // 3. Se tiver vírgula (padrão brasileiro), troca por ponto
      // Se tiver ponto de milhar (ex: 1.000,00), removemos o ponto e tratamos a vírgula
      if (priceClean.includes(',') && priceClean.includes('.')) {
         priceClean = priceClean.replace(/\./g, '').replace(',', '.');
      } else {
         priceClean = priceClean.replace(',', '.');
      }

      const priceNumber = parseFloat(priceClean);

      return {
        id: String(item.id),
        title: String(item.title),
        unit_price: Number(priceNumber.toFixed(2)), // Força 2 casas decimais e tipo Number
        quantity: Number(item.quantity),
        currency_id: 'BRL'
      };
    });

    const body = {
      items: itemsParaMP,
      back_urls: {
        success: "https://carlafigueiredo.shop/sucesso",
        failure: "https://carlafigueiredo.shop/carrinho",
        pending: "https://carlafigueiredo.shop/sucesso"
      },
      auto_return: 'approved',
    };

    const result = await preference.create({ body });

    return {
      statusCode: 200,
      headers: {
        "Content-Type": "application/json",
        "Access-Control-Allow-Origin": "*"
      },
      body: JSON.stringify({ init_point: result.init_point })
    };

  } catch (error) {
    console.error("ERRO DETALHADO NO MP:", error);
    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ 
        error: "Erro ao gerar pagamento", 
        message: error.message 
      }) 
    };
  }
};