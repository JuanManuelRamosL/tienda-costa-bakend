 const { MercadoPagoConfig, Preference } = require('mercadopago');
const Pedido = require('../models/pedidosModel');
const { getChannel } = require('../rabbitmq');

// Configuración de Mercado Pago con el token de acceso
const client = new MercadoPagoConfig({ accessToken: 'APP_USR-454029493775761-120922-f8313c5d85da1fa5a1dcae1cfa22d181-510213617' });
const preference = new Preference(client);
// credenciales produccion APP_USR-4239051252843673-111014-8adace428345b1f324f381fc79942b37-370915835
// credencial de prueba APP_USR-606095260540143-111014-79210c1a47e51601f405331300802dfc-2090297928
// Variable para almacenar temporalmente el email
let payament_id = null

// Función para crear una orden
const createOrder = async (req, res) => {
  try {
    const { title, quantity, unit_price, direccion, nombre, email ,telefono,userId} = req.body;

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
      cantidad:quantity,
      barcode_url:"",
      qr_url:"",
      userId
    };
    //agregar userid despues en el front hacemos la peticion get a pedidos con el id del user 

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

   /*  // Si el tipo es 'payment' y tenemos un email guardado
    if (type === 'payment' && payament_id) {
      // Llamar a la función updateStatusByEmail con el email almacenado en memoria
      await Pedido.updateStatusByPaymentId(payament_id, { pagado: "si" });

      // Limpiar la variable temporal después de usarla
      payament_id = null;
    }

    res.sendStatus(200); */

    if (type === 'payment' && payament_id) {
      // Actualizar el pedido como pagado
      const pedido = await Pedido.getByPaymentId(payament_id);

      if (!pedido) {
        console.error("Pedido no encontrado para el payment_id:", payament_id);
        return res.sendStatus(404);
      }

      // await Pedido.updateStatusByPaymentId(payament_id, { pagado: "si" });
      // Guardar las rutas de los códigos en la base de datos
     await Pedido.updateStatusByPaymentId(payament_id, {
       pagado: "si",
       barcode_url: "", // Ruta del código de barras
       qr_url: "",           // Ruta del QR
         });

/*          const message = {
          email: pedido.email,
          nombre: pedido.nombre,
          producto: pedido.producto,
          cantidad: pedido.cantidad,
          direccion: pedido.direccion,
        };
  
        // Publicar en RabbitMQ
        const channel = getChannel();
        channel.assertQueue('email.notifications', { durable: true });
        channel.sendToQueue('email.notifications', Buffer.from(JSON.stringify(message)));
        console.log('Mensaje publicado en RabbitMQ:', message); */
      payament_id = null;

      console.log('Códigos generados y almacenados correctamente.');
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

const actualizarEstado = async (req, res) => {
  const { id } = req.params;
  const { estado } = req.body;

  if (!estado) {
      return res.status(400).json({ error: 'El campo estado es requerido' });
  }

  try {
      const pedidoActualizado = await Pedido.updateStatus(id, estado);
      res.status(200).json(pedidoActualizado);
  } catch (error) {
      console.error('Error al actualizar el estado del pedido:', error);
      res.status(500).json({ error: 'Error al actualizar el estado del pedido' });
  }
};

const obtenerPedidoUser = async (req, res) => {
  let { id } = req.params;

  if (!id) {
      return res.status(400).json({ error: 'El campo id es requerido' });
  }

  // Convertimos el id a string explícitamente
  id = id.toString();

  try {
      const pedido = await Pedido.getByUserId(id);
      if (pedido.length === 0) {
          return res.status(404).json({ error: 'No se encontraron pedidos para este usuario' });
      }

      res.status(200).json(pedido);
  } catch (error) {
      console.error('Error al obtener los pedidos del usuario:', error);
      res.status(500).json({ error: 'Error al obtener los pedidos del usuario' });
  }
};


module.exports = { createOrder, recibeWebhook,deleteOrder,deleteAllOrders,getAll,actualizarEstado,obtenerPedidoUser }; 


// tarjeta : 5031 7557 3453 0604
//name APRO
// date : 11/25
// psw: 123
// dni 12345678

//user TESTUSER2035541374
// psw  l6unw3aPJQ

