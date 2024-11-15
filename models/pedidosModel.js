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
            'INSERT INTO pedidos (direccion, telefono, nombre, email, pagado, payment_id,producto,cantidad) VALUES ($1, $2, $3, $4, $5, $6, $7, $8) RETURNING *',
            [pedidoData.direccion, pedidoData.telefono, pedidoData.nombre, pedidoData.email, pedidoData.pagado, pedidoData.payment_id,pedidoData.producto, pedidoData.cantidad]
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
};

module.exports = Pedido;
