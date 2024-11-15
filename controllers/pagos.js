 const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/pedidosModel');
const { default: axios } = require('axios');

// Configuración de Mercado Pago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-606095260540143-111014-79210c1a47e51601f405331300802dfc-2090297928' });
const preference = new Preference(client);

// Variable para almacenar temporalmente el email
let tempEmail = null;
let payament_id = null

// Función para crear una orden
const createOrder = async (req, res) => {
  try {
    const { title, quantity, unit_price, direccion, nombre, email ,telefono} = req.body;

    if (!title || !quantity || !unit_price || !direccion || !nombre || !email) {
      return res.status(400).json({ error: 'Todos los campos (title, quantity, unit_price, direccion, nombre y email) son requeridos' });
    }

    const response = await preference.create({
      body: {
        items: [{ title, quantity, unit_price }],
        //notification_url: "https://r3dgnqr9-3000.brs.devtunnels.ms/api/webhook"
        notification_url: "https://tienda-costa-bakend.vercel.app/api/webhook"
      },
    });

    if (!response || !response.id || !response.init_point) {
      console.error("Error: La respuesta no contiene las propiedades 'id' o 'init_point' esperadas");
      return res.status(500).json({ error: 'La respuesta de Mercado Pago es inválida' });
    }

    // Guardar el email temporalmente
    //tempEmail = email;
    payament_id=response.id

    const pedido = {
      direccion,
      nombre,
      email,
      pagado: "no",
      payment_id: response.id,
      telefono,
      producto:title,
      cantidad:quantity
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

// Función para manejar el webhook
const recibeWebhook = async (req, res) => {
  try {
    const { type } = req.query;

    // Si el tipo es 'payment' y tenemos un email guardado
    if (type === 'payment' && payament_id) {
      // Llamar a la función updateStatusByEmail con el email almacenado en memoria
      await Pedido.updateStatusByPaymentId(payament_id, { pagado: "si" });

      // Limpiar la variable temporal después de usarla
      payament_id = null;
    }

    res.sendStatus(200);
  } catch (error) {
    console.error("Error en el webhook de Mercado Pago:", error);
    res.sendStatus(500);
  }
};


// Controlador para eliminar una orden por ID
const deleteOrder = async (req, res) => {
  const { id } = req.body; // Obtenemos el ID del pedido desde el body

  if (!id) {
    return res.status(400).json({ error: 'El ID del pedido es requerido' });
  }

  try {
    // Verificar si la orden existe
    const pedido = await Pedido.getById(id);
    if (!pedido) {
      return res.status(404).json({ error: 'Orden no encontrada' });
    }

    // Eliminar la orden
    await Pedido.delete(id);
    res.status(200).json({ message: 'Orden eliminada correctamente' });
  } catch (error) {
    console.error('Error al eliminar la orden:', error);
    res.status(500).json({ error: 'Error al eliminar la orden' });
  }
};

const deleteAllOrders = async (req, res) => {
  try {
    await Pedido.deleteAll();
    res.status(200).json({ message: 'Todas las órdenes fueron eliminadas correctamente' });
  } catch (error) {
    console.error('Error al eliminar todas las órdenes:', error);
    res.status(500).json({ error: 'Error al eliminar todas las órdenes' });
  }
};

const getAll = async (req, res) => {
  try {
    const pedidos = await Pedido.getAll();
    res.status(200).json(pedidos);
  } catch (error) {
    console.error('Error al eliminar todas las órdenes:', error);
    res.status(500).json({ error: 'Error al eliminar todas las órdenes' });
  }
};


module.exports = { createOrder, recibeWebhook,deleteOrder,deleteAllOrders,getAll }; 


// tarjeta : 5031 7557 3453 0604
//name APRO
// date : 11/25
// psw: 123
// dni 12345678

//user TESTUSER2035541374
// psw  l6unw3aPJQ