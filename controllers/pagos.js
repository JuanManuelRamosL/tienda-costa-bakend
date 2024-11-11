const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/pedidosModel');

// Configuración de Mercado Pago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-606095260540143-111014-79210c1a47e51601f405331300802dfc-2090297928' });
const preference = new Preference(client);

// Función para crear una orden
const createOrder = async (req, res) => {
  try {
    // Extraer valores del cuerpo de la solicitud POST
    const { title, quantity, unit_price, direccion, nombre, email } = req.body;

    // Verificar que todos los valores requeridos están presentes
    if (!title || !quantity || !unit_price || !direccion || !nombre || !email) {
      return res.status(400).json({ error: 'Todos los campos (title, quantity, unit_price, direccion, nombre y email) son requeridos' });
    }
    // Crear preferencia de pago con los valores del body
    const response = await preference.create({
      body: {
        items: [
          {
            title,
            quantity,
            unit_price,
          },
        ],
      },
    });

    console.log("Respuesta de Mercado Pago:", response);

    // Acceder directamente a response.id y response.init_point
    if (!response || !response.id || !response.init_point) {
      console.error("Error: La respuesta no contiene las propiedades 'id' o 'init_point' esperadas");
      return res.status(500).json({ error: 'La respuesta de Mercado Pago es inválida' });
    }
    let pedido = {
      direccion:direccion,
      nombre:nombre,
      email:email,
      pagado:"no"
    }

    const pedidoCreate = await Pedido.create(pedido)
    console.log(pedidoCreate)
    // Respuesta en caso de éxito
    res.json({ preferenceId: response.id, initPoint: response.init_point ,url:response.sandbox_init_point});
  } catch (error) {
    console.error("Error al crear la preferencia de pago:", error.message);

    // Si el error tiene una respuesta de Mercado Pago, muestra el detalle
    if (error.response) {
      console.error("Detalles del error de la respuesta:", error.response.data);
      return res.status(500).json({ error: error.response.data });
    }

    res.status(500).json({ error: 'Error al crear la orden' });
  }
};

module.exports = { createOrder };
