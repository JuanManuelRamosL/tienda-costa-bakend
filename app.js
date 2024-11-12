// app.js
const express = require('express');
const bodyParser = require('body-parser');
const productRoutes = require('./routes/productRoutes');
const userRoutes = require('./routes/userRoutes');
const pagosRouters = require('./routes/pagosRoutes');
const morgan = require('morgan');
const cors = require('cors');

require('dotenv').config();

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(morgan("dev"))

// Rutas
app.use('/api', productRoutes);
app.use("/api",userRoutes)
app.use("/api",pagosRouters)

module.exports = app;
