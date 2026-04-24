const { MercadoPagoConfig, Preference } = require('mercadopago');

const client = new MercadoPagoConfig({ 
  accessToken: process.env.MP_ACCESS_TOKEN 
});

exports.handler = async (event) => {
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

    const preference = new Preference(client);

    const itemsParaMP = cart.map(item => {
      // 1. Pega o preço e remove TUDO que não for número, ponto ou vírgula
      let precoOriginal = String(item.price || "0");
      let apenasNumeros = precoOriginal.replace(/[^\d,.]/g, '');

      // 2. Lida com o formato brasileiro (converte vírgula para ponto)
      if (apenasNumeros.includes(',') && apenasNumeros.includes('.')) {
        apenasNumeros = apenasNumeros.replace(/\./g, '').replace(',', '.');
      } else {
        apenasNumeros = apenasNumeros.replace(',', '.');
      }

      // 3. Converte para número e garante que não seja NaN ou 0
      let precoFinal = parseFloat(apenasNumeros);
      if (isNaN(precoFinal) || precoFinal <= 0) {
        precoFinal = 1.00; // Valor de segurança caso o preço chegue errado
      }

      console.log(`Item: ${item.title} | Preço Original: ${precoOriginal} | Preço Final: ${precoFinal}`);

      return {
        id: String(item.id),
        title: String(item.title).substring(0, 255), // Limite de caracteres do MP
        unit_price: Number(precoFinal.toFixed(2)),
        quantity: Number(item.quantity) || 1,
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
    console.error("ERRO NO BACKEND:", error);
    return { 
      statusCode: 500, 
      headers: { "Access-Control-Allow-Origin": "*" },
      body: JSON.stringify({ error: error.message }) 
    };
  }
};