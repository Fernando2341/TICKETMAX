import express, { Request, Response } from 'express';
import { Bot } from '@botpress/sdk';
import { exec } from 'child_process';
import cors from 'cors';
import mongoose from 'mongoose';

const app = express();

// Configuración de CORS
app.use(
  cors({
    origin: ['http://localhost:5173', 'http://localhost:8080'],
    methods: ['GET', 'POST'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
  })
);

app.use(express.json()); // Asegura que los JSON en las solicitudes se analicen correctamente

const bot = new Bot({
  actions: {}, // Personaliza las acciones si es necesario
});

// Conectar a MongoDB
mongoose.connect('mongodb://localhost:27017/ticketmaxBD')
  .then(() => console.log('Conectado a MongoDB'))
  .catch((error) => console.error('Error al conectar a MongoDB:', error));

// Esquema de usuario y modelo de MongoDB (como ejemplo)
const userSchema = new mongoose.Schema({
  username: String,
  email: String,
});

const User = mongoose.model('User', userSchema);

// Función para invocar el script de Python y obtener respuesta del modelo GPT
const runGPTInference = (message: string): Promise<string> => {
  return new Promise((resolve, reject) => {
    exec(`python ai/gpt_inference.py "${message}"`, (error, stdout, stderr) => {
      if (error) {
        reject(`Error al ejecutar el script: ${error.message}`);
        return;
      }
      if (stderr) {
        reject(`Error en el script: ${stderr}`);
        return;
      }
      resolve(stdout.trim()); // La salida es la respuesta generada por el modelo GPT
    });
  });
};

// Función para verificar si el usuario existe en la base de datos
const checkUserExistence = async (username: string): Promise<boolean> => {
  try {
    const user = await User.findOne({ username });
    return user !== null;  // Si el usuario existe, se devuelve true
  } catch (error) {
    console.error('Error al verificar la existencia del usuario:', error);
    return false;
  }
};

// Configuración del bot para manejar mensajes
bot.message(async ({ message, client, ctx }) => {
  console.log('Received message:', message.payload.text);

  try {
    // Si el mensaje incluye "usuario" y "existe", revisa la existencia de un usuario
    if (message.payload.text.toLowerCase().includes('¿existe el usuario')) {
      const username = message.payload.text.split('¿existe el usuario ')[1]?.replace('?', '').trim();
      const userExists = await checkUserExistence(username);

      if (userExists) {
        await client.createMessage({
          conversationId: message.conversationId,
          userId: ctx.botId,
          type: 'text',
          payload: {
            text: `El usuario ${username} existe.`,
          },
          tags: {}
        });
      } else {
        await client.createMessage({
          conversationId: message.conversationId,
          userId: ctx.botId,
          type: 'text',
          payload: {
            text: `El usuario ${username} no existe.`,
          },
          tags: {}
        });
      }
    } else {
      // Usar GPT para generar una respuesta si no se está consultando la base de datos
      const gptResponse = await runGPTInference(message.payload.text);
      await client.createMessage({
        conversationId: message.conversationId,
        userId: ctx.botId,
        type: 'text',
        payload: {
          text: gptResponse,
        },
        tags: {}
      });
    }

    console.log('Text message sent');
  } catch (error) {
    console.error('Error al generar la respuesta:', error);
    await client.createMessage({
      conversationId: message.conversationId,
      userId: ctx.botId,
      type: 'text',
      payload: {
        text: 'Hubo un error al generar la respuesta. Intenta nuevamente más tarde.',
      },
      tags: {}
    });
  }
});

// Endpoint REST para interactuar con el bot
app.post('/api/chat', async (req: Request, res: Response): Promise<void> => {
  const { message } = req.body;

  if (!message) {
    res.status(400).json({ response: 'No se proporcionó un mensaje' });
    return;
  }

  try {
    // Usar GPT para generar una respuesta real
    const botResponse = await runGPTInference(message);
    res.json({ response: botResponse });
  } catch (error) {
    console.error('Error al procesar el mensaje:', error);
    res.status(500).json({ response: `Error al procesar tu mensaje` });
  }
});

// Inicia el bot
bot.start().then(() => {
  console.log('Bot started successfully');
});

// Inicia el servidor Express
const PORT = process.env.PORT || 8085;
app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});
