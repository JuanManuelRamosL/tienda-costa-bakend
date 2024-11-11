// models/userModel.js
const pool = require('../config/database');

const User = {
    create: async (user) => {
        const { name, email, password, photo } = user;
        const result = await pool.query(
            'INSERT INTO users (name, email, password, photo) VALUES ($1, $2, $3, $4) RETURNING *',
            [name, email, password, photo] // almacena la contraseña en texto plano
        );
        return result.rows[0];
    },

    update: async (id, user) => {
        const { name, email, password, photo } = user;
        const result = await pool.query(
            'UPDATE users SET name = $1, email = $2, password = COALESCE($3, password), photo = $4 WHERE id = $5 RETURNING *',
            [name, email, password, photo, id] // almacena la contraseña en texto plano
        );
        return result.rows[0];
    },

    delete: async (id) => {
        await pool.query('DELETE FROM users WHERE id = $1', [id]);
    },

    findByEmailOrName: async (email, name) => {
        const result = await pool.query('SELECT * FROM users WHERE email = $1 OR name = $2', [email, name]);
        return result.rows[0];
    },

    findById: async (id) => {
        const result = await pool.query('SELECT * FROM users WHERE id = $1', [id]);
        return result.rows[0];
    },

    validatePassword: async (password, storedPassword) => {
        // Ahora simplemente compara el texto plano
        return password === storedPassword;
    }
};

module.exports = User;
