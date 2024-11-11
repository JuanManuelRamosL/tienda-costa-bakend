const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/pedidosModel');
const { default: axios } = require('axios');

// Configuración de Mercado Pago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-606095260540143-111014-79210c1a47e51601f405331300802dfc-2090297928' });
const preference = new Preference(client);

// Función para crear una orden
const createOrder = async (req, res) => {
  try {
    const { title, quantity, unit_price, direccion, nombre, email } = req.body;

    if (!title || !quantity || !unit_price || !direccion || !nombre || !email) {
      return res.status(400).json({ error: 'Todos los campos (title, quantity, unit_price, direccion, nombre y email) son requeridos' });
    }

    const response = await preference.create({
      body: {
        items: [{ title, quantity, unit_price }],
        notification_url: "https://r3dgnqr9-3000.brs.devtunnels.ms/api/webhook"
      },
    });

    if (!response || !response.id || !response.init_point) {
      console.error("Error: La respuesta no contiene las propiedades 'id' o 'init_point' esperadas");
      return res.status(500).json({ error: 'La respuesta de Mercado Pago es inválida' });
    }

    const pedido = {
      direccion,
      nombre,
      email,
      pagado: "no",
      payment_id: response.id
    };

    const pedidoCreate = await Pedido.create(pedido);
    res.json({ preferenceId: response.id, initPoint: response.init_point, url: response.sandbox_init_point });
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error.message);

    if (error.response) {
      console.error("Detalles del error de la respuesta:", error.response.data);
      return res.status(500).json({ error: error.response.data });
    }

    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

const recibeWebhook = async (req, res) => {
  try {
    const { type, id } = req.query;

    if (type === 'payment') {
      // Obtiene información detallada del pago usando el ID de pago
      const paymentInfo = await axios.get(`https://api.mercadopago.com/v1/payments/${id}`, {
        headers: {
          Authorization: `Bearer ${process.env.MERCADOPAGO_ACCESS_TOKEN}`
        }
      });
console.log(paymentInfo.data)
      const paymentStatus = paymentInfo.data.status;
      const preferenceId = paymentInfo.data.preference_id;  // Este es el ID de preferencia que guardaste

      // Actualiza el estado del pedido en la base de datos usando el preference_id
      if (paymentStatus === 'approved') {
        await Pedido.updateStatusByPreferenceId(preferenceId, { pagado: 'si' });
      }
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en el webhook de Mercado Pago:", error);
    res.sendStatus(500);
  }
};


module.exports = { createOrder, recibeWebhook };