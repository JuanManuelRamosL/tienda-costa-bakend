// controllers/productController.js
const Product = require('../models/productModel');

const productController = {
    getAllProducts: async (req, res) => {
        const products = await Product.getAll();
        res.json(products);
    },

    getProductById: async (req, res) => {
        const product = await Product.getById(req.params.id);
        res.json(product);
    },

    createProduct: async (req, res) => {
        const newProduct = await Product.create(req.body);
        res.status(201).json(newProduct);
    },

    updateProduct: async (req, res) => {
        const updatedProduct = await Product.update(req.params.id, req.body);
        res.json(updatedProduct);
    },

    deleteProduct: async (req, res) => {
        await Product.delete(req.params.id);
        res.status(204).send();
    },
};

module.exports = productController;
