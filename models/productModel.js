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
        const { name, description, price } = product;
        const result = await pool.query(
            'INSERT INTO products (name, description, price) VALUES ($1, $2, $3) RETURNING *',
            [name, description, price]
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

    delete: async (id) => {
        await pool.query('DELETE FROM products WHERE id = $1', [id]);
    },
};

module.exports = Product;
