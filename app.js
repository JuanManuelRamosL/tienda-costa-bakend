// app.js
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const pagosRouters = require('./routes/pagosRoutes');
const morgan = require('morgan');
const cors = require('cors');
const { connectRabbitMQ } = require('./rabbitmq');

require('dotenv').config();

const app = express();
app.use(cors("*"));
app.use(bodyParser.json());
app.use(express.json());
app.use(morgan("dev"))

connectRabbitMQ().catch((error) => {
    console.error('Error al conectar con RabbitMQ:', error);
    process.exit(1); // Finalizar la aplicación si falla la conexión
});
// Rutas
app.use('/api', productRoutes);
app.use("/api",userRoutes)
app.use("/api",pagosRouters)

module.exports = app;
//db: postgres://neondb_owner:oSJI0Aarsf2q@ep-nameless-frost-a4l1qafn-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require