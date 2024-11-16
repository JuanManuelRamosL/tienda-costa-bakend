const { Pool } = require('pg');
require('dotenv').config();

/* const pool = new Pool({
    user: process.env.DB_USER,
    host: process.env.DB_HOST,
    database: process.env.DB_NAME,
    password: process.env.DB_PASSWORD,
    port: process.env.DB_PORT,
}); */

const pool = new Pool({
    connectionString: process.env.POSTGRES_URL,
  })

// Función para crear tablas si no existen
const initializeDatabase = async () => {
    const createProductsTable = `
        CREATE TABLE IF NOT EXISTS products (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            description TEXT,
            price DECIMAL(10, 2) NOT NULL,
            image TEXT,
            category TEXT
        );
    `;

    const createUsersTable = `
        CREATE TABLE IF NOT EXISTS users (
            id SERIAL PRIMARY KEY,
            name VARCHAR(100) NOT NULL,
            email VARCHAR(100) UNIQUE NOT NULL,
            password VARCHAR(100),
            photo TEXT
        );
    `;

    const createOrdersTable = `
        CREATE TABLE IF NOT EXISTS orders (
            id SERIAL PRIMARY KEY,
            user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
            product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
            status VARCHAR(50) DEFAULT 'en proceso',
            quantity INTEGER DEFAULT 1,
            order_date TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;

    // Nueva tabla 'pedidos' con los campos solicitados
    const createPedidosTable = `
        CREATE TABLE IF NOT EXISTS pedidos (
            id SERIAL PRIMARY KEY,
            direccion VARCHAR(255) NOT NULL,
            telefono VARCHAR(255) NOT NULL,
            nombre VARCHAR(100) NOT NULL,
            email VARCHAR(100) NOT NULL,
            pagado VARCHAR(10) DEFAULT '',
            payment_id VARCHAR(100) UNIQUE,
            producto TEXT,
            cantidad INTEGER,
            barcode_url TEXT,
            qr_url TEXT
        );
    `;

    try {
        await pool.query(createProductsTable);
        await pool.query(createUsersTable);
        await pool.query(createOrdersTable);
        await pool.query(createPedidosTable); // Ejecuta la creación de la tabla 'pedidos'
        console.log('Tablas "products", "users", "orders" y "pedidos" verificadas o creadas exitosamente.');
    } catch (error) {
        console.error('Error al crear/verificar las tablas:', error);
    }
};

// Ejecuta la inicialización al importar el módulo
initializeDatabase();

module.exports = pool;
