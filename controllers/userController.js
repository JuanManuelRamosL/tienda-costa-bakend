// controllers/userController.js
const User = require('../models/userModel');

const userController = {
    createUser: async (req, res) => {
        try {
            console.log(req.body)
            const user = await User.create(req.body);
            res.status(201).json(user);
        } catch (error) {
            res.status(400).json({ error: 'Error al crear usuario.' });
        }
    },

    updateUser: async (req, res) => {
        try {
            const user = await User.update(req.params.id, req.body);
            res.json(user);
        } catch (error) {
            res.status(400).json({ error: 'Error al actualizar usuario.' });
        }
    },

    deleteUser: async (req, res) => {
        try {
            await User.delete(req.params.id);
            res.status(204).send();
        } catch (error) {
            res.status(400).json({ error: 'Error al eliminar usuario.' });
        }
    },

    loginUser: async (req, res) => {
        const { email, name, password } = req.body;
        try {
            const user = await User.findByEmailOrName(email, name);
            if (!user || (password && !(await User.validatePassword(password, user.password)))) {
                return res.status(401).json({ error: 'Credenciales incorrectas.' });
            }
            res.json({ message: 'Login exitoso', user });
        } catch (error) {
            res.status(400).json({ error: 'Error al iniciar sesión.' });
        }
    }
};

module.exports = userController;
