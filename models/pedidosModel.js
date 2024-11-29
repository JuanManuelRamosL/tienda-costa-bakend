const pool = require('../config/database');

const Pedido = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM pedidos');
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query('SELECT * FROM pedidos WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (pedidoData) => {
        const result = await pool.query(
            'INSERT INTO pedidos (direccion, telefono, nombre, email, pagado, payment_id,producto,cantidad,userId) VALUES ($1, $2, $3, $4, $5, $6, $7, $8,$9) RETURNING *',
            [pedidoData.direccion, pedidoData.telefono, pedidoData.nombre, pedidoData.email, pedidoData.pagado, pedidoData.payment_id,pedidoData.producto, pedidoData.cantidad,pedidoData.userId]
        );
        
        return result.rows[0];
      },
    
      updateStatusByPaymentId:async (payament_id, data) => { 
        const result = await pool.query(
          'UPDATE pedidos SET pagado = $1 WHERE payment_id = $2 RETURNING *',
          [data.pagado, payament_id]
        );
        return result.rows[0];
    }, 
 /*    updateStatusByPaymentId: async (payament_id, data) => { 
        const { pagado, barcode_url, qr_url } = data; // Desestructurar los datos para claridad
      
        const result = await pool.query(
          `UPDATE pedidos 
           SET pagado = $1, 
               barcode_url = $2, 
               qr_url = $3 
           WHERE payment_id = $4 
           RETURNING *`,
          [pagado, barcode_url, qr_url, payament_id] // Pasar los valores en el orden correcto
        );
      
        return result.rows[0]; // Devolver el registro actualizado
      }, */
      

    update: async (id, pedido) => {
        const { direccion, nombre, email, pagado } = pedido;
        const result = await pool.query(
            'UPDATE pedidos SET direccion = $1, nombre = $2, email = $3, pagado = $4 WHERE id = $5 RETURNING *',
            [direccion, nombre, email, pagado, id]
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM pedidos WHERE id = $1', [id]);
    },
    deleteAll: async () => {
        await pool.query('DELETE FROM pedidos'); // Eliminar todas las órdenes
    },
    getByPaymentId: async (payment_id) => {
        const result = await pool.query(
          `SELECT * FROM pedidos WHERE payment_id = $1`,
          [payment_id]
        );
      
        // Si no se encuentra ningún pedido, devolver null
        if (result.rows.length === 0) {
          return null;
        }
      
        // Devolver el primer pedido encontrado
        return result.rows[0];
      },
      updateStatus: async (id, estado) => {
        try {
            const result = await pool.query(
                'UPDATE pedidos SET estado = $1 WHERE id = $2 RETURNING *',
                [estado, id]
            );

            if (result.rows.length === 0) {
                throw new Error(`Pedido con id ${id} no encontrado`);
            }

            return result.rows[0]; // Devuelve el pedido actualizado
        } catch (error) {
            console.error('Error al actualizar el estado del pedido:', error);
            throw error; // Lanza el error para que el controlador lo maneje
        }
    },
    getByUserId: async (userId) => {
        const result = await pool.query(
            'SELECT * FROM pedidos WHERE userId = $1',
            [userId]
        );
        return result.rows; // Devuelve todos los pedidos asociados al userId
    },
    
};

module.exports = Pedido;
