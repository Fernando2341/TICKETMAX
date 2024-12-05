const express = require('express');
const { body, validationResult } = require('express-validator');
const Admin = require('../models/Admin');
const Promoter = require('../models/Promoter');
const router = express.Router();

// Ruta de inicio de sesión para admins y promotores
router.post('/login', [
  body('email').notEmpty().withMessage('El correo es obligatorio'),
  body('password').notEmpty().withMessage('La contraseña es obligatoria'),
], async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { email, password, role } = req.body; // 'role' puede ser 'admin' o 'promoter'

  try {
    let user;

    if (role === 'admin') {
      user = await Admin.findOne({ email });
    } else if (role === 'promoter') {
      user = await Promoter.findOne({ email });
    }

    if (!user) {
      return res.status(401).json({ message: 'Usuario no encontrado' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Contraseña incorrecta' });
    }

    const redirectPath = role === 'admin' ? '/create-event' : '/';
    res.json({ message: 'Inicio de sesión exitoso', redirectPath });
  } catch (err) {
    console.error('Error durante el inicio de sesión:', err);
    res.status(500).json({ message: 'Error en el servidor' });
  }
});

module.exports = router;
