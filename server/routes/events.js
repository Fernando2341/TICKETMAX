const express = require('express');
const router = express.Router();
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const Event = require('../models/Event');  // Asegúrate de que la ruta es correcta
const mongoose = require('mongoose');

// Configuración de multer para subir imágenes
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const eventName = req.body.name;
    const uploadPath = path.join(__dirname, '../uploads', eventName);
    fs.access(uploadPath, fs.constants.F_OK, (err) => {
      if (err) {
        fs.mkdir(uploadPath, { recursive: true }, (mkdirErr) => {
          if (mkdirErr) {
            return cb(mkdirErr, null);
          }
          cb(null, uploadPath);
        });
      } else {
        cb(null, uploadPath);
      }
    });
  },
  filename: (req, file, cb) => {
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    cb(null, `${file.fieldname}-${uniqueSuffix}-${file.originalname}`);
  },
});

const upload = multer({ storage });

// Ruta para crear eventos
router.post(
  '/create',
  upload.fields([{ name: 'image', maxCount: 1 }, { name: 'head', maxCount: 1 }]),
  async (req, res) => {
    try {
      const { name, subtitle, eventType, category, promoter, paymentMethods } = req.body;

      if (!req.files || !req.files['image'] || !req.files['head']) {
        return res.status(400).json({ error: 'Las imágenes son obligatorias.' });
      }

      const parsedPaymentMethods = JSON.parse(paymentMethods);

      const newEvent = new Event({
        name,
        subtitle,
        eventType,
        category,
        promoter,
        paymentMethods: parsedPaymentMethods,
        image: `/uploads/${name}/${req.files['image'][0].filename}`,
        head: `/uploads/${name}/${req.files['head'][0].filename}`,
      });

      await newEvent.save();
      res.status(201).json({ message: 'Evento creado exitosamente', event: newEvent });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Error al crear el evento.' });
    }
  }
);

// Ruta para obtener todos los eventos
router.get('/', async (req, res) => {
  try {
    const events = await Event.find();
    res.json(events);
  } catch (error) {
    console.error('Error al obtener los eventos:', error);
    res.status(500).json({ error: 'Error al obtener los eventos' });
  }
});

// Ruta para obtener evento por ID
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  console.log('Solicitud para obtener evento con ID:', id);

  if (!mongoose.Types.ObjectId.isValid(id)) {
    return res.status(400).json({ message: 'ID no válido' });
  }

  try {
    const event = await Event.findById(id);
    console.log('Evento encontrado:', event);  // Verificar los datos del evento
    if (!event) {
      return res.status(404).json({ error: 'Evento no encontrado' });
    }
    res.json(event);
  } catch (error) {
    console.error('Error al obtener el evento:', error.message);
    res.status(500).json({ error: 'Error del servidor al obtener el evento' });
  }
});

// Ruta para eliminar un evento
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const deletedEvent = await Event.findByIdAndDelete(id);
    if (!deletedEvent) {
      return res.status(404).json({ error: 'Evento no encontrado.' });
    }

    const eventFolderPath = path.join(__dirname, '../uploads', deletedEvent.name);
    fs.rm(eventFolderPath, { recursive: true, force: true }, (err) => {
      if (err) {
        console.error(`Error al eliminar la carpeta del evento ${deletedEvent.name}:`, err);
      }
    });

    res.status(200).json({ message: 'Evento eliminado exitosamente.' });
  } catch (error) {
    console.error('Error al eliminar evento:', error);
    res.status(500).json({ error: 'Error al eliminar el evento.' });
  }
});

module.exports = router;
