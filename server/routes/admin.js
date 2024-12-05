const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const Admin = require('../models/Admin');
const Promoter = require('../models/Promoter');
const Sellpoint = require('../models/Sellpoint');  // Necesitarás este modelo más adelante

router.post('/create-user', async (req, res) => {
  const { email, password, role } = req.body;

  try {
    // Verifica si ya existe un usuario con el mismo correo en el rol adecuado
    let existingUser;
    if (role === 'admin') {
      existingUser = await Admin.findOne({ email });
    } else if (role === 'promoter') {
      existingUser = await Promoter.findOne({ email });
    } else if (role === 'sellpoint') {
      existingUser = await Sellpoint.findOne({ email });
    }

    if (existingUser) {
      return res.status(400).json({ message: 'El usuario ya existe' });
    }

    // Encripta la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Crea un nuevo usuario según el rol
    let newUser;
    if (role === 'admin') {
      newUser = new Admin({ email, password: hashedPassword });
    } else if (role === 'promoter') {
      newUser = new Promoter({ email, password: hashedPassword });
    } else if (role === 'sellpoint') {
      newUser = new Sellpoint({ email, password: hashedPassword });
    }

    await newUser.save();
    res.status(201).json({ message: 'Usuario creado exitosamente' });

  } catch (err) {
    console.error('Error al crear usuario:', err);
    res.status(500).json({ message: 'Error interno del servidor' });
  }
});

module.exports = router;
