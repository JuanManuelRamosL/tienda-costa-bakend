// models/productModel.js
const pool = require('../config/database');

const Product = {
    getAll: async () => {
        const result = await pool.query('SELECT * FROM products');
        return result.rows;
    },

    getById: async (id) => {
        const result = await pool.query('SELECT * FROM products WHERE id = $1', [id]);
        return result.rows[0];
    },

    create: async (product) => {
        const { name, description, price,image,category,stock } = product;
        const result = await pool.query(
            'INSERT INTO products (name, description, price,image,category,stock) VALUES ($1, $2, $3, $4, $5,$6) RETURNING *',
            [name, description, price,image,category,stock]
        );
        return result.rows[0];
    },

    update: async (id, product) => {
        const { name, description, price } = product;
        const result = await pool.query(
            'UPDATE products SET name = $1, description = $2, price = $3 WHERE id = $4 RETURNING *',
            [name, description, price, id]
        );
        return result.rows[0];
    },
    updateStock: async (id, stock) => {
        const result = await pool.query(
            'UPDATE products SET stock = $1 WHERE id = $2 RETURNING *',
            [stock, id]
        );
        return result.rows[0];
    },

    decreaseStock: async (id, quantity) => {
        const result = await pool.query(
            `UPDATE products 
             SET stock = stock - $1 
             WHERE id = $2 AND stock >= $1 
             RETURNING *`, // Asegura que no haya stock negativo
            [quantity, id]
        );
        if (result.rowCount === 0) {
            throw new Error('Stock insuficiente o producto no encontrado.');
        }
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    },
};

module.exports = Product;
