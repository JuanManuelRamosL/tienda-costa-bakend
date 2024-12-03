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
    
    updateStock: async (req, res) => {
        try {
            const { stock } = req.body; // Extraer el stock del cuerpo
            const updatedProductStock = await Product.updateStock(req.params.id, stock); // Pasar valores correctos
            res.json(updatedProductStock);
        } catch (error) {
            console.error(error);
            res.status(500).json({ error: 'Error al actualizar el stock' });
        }
    },

    decreaseStock: async (req, res) => {
        try {
            const { quantity } = req.body; // Extraer cantidad del body
            const updatedProductStock = await Product.decreaseStock(req.params.id, quantity || 1); // Restar 1 por defecto si no se envía cantidad
            res.json(updatedProductStock);
        } catch (error) {
            console.error(error.message);
            res.status(400).json({ error: error.message });
        }
    },
    deleteProduct: async (req, res) => {
        await Product.delete(req.params.id);
        res.status(204).send();
    },
};

module.exports = productController;
