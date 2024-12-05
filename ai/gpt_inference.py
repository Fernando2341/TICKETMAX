from transformers import GPTNeoForCausalLM, AutoTokenizer
import torch
from langdetect import detect
from pymongo import MongoClient

# Conectar con la base de datos MongoDB
client = MongoClient("mongodb://localhost:27017/")
db = client['ticketmaxBD']
events_collection = db['events']

# Carga el modelo y el tokenizador
model_name = "EleutherAI/gpt-neo-125M"
tokenizer = AutoTokenizer.from_pretrained(model_name)
model = GPTNeoForCausalLM.from_pretrained(model_name)

# Configura los tokens
tokenizer.pad_token = tokenizer.eos_token  # Asignamos el token de finalización como token de relleno

# Función para obtener información sobre los eventos
def get_event_info(event_name="evento_prueba"):
    event = events_collection.find_one({"name": event_name})
    if event:
        return f"Evento: {event['name']}, Fecha: {event['date']}, Ubicación: {event['location']}, Disponibilidad: {event['availability']}"
    else:
        return "Lo siento, no encontré información sobre el evento solicitado."

# Función para generar la respuesta basada en el idioma
def generate_response(input_text):
    try:
        # Detectamos el idioma del mensaje del usuario
        language = detect(input_text)
        
        # Definir el contexto basado en el idioma
        if language == 'es':
            context = (
                "Eres un asistente virtual para Ticketmax.mx, una plataforma de venta de entradas para eventos en México. "
                "Los usuarios pueden preguntar sobre eventos, disponibilidad de boletos, problemas de inicio de sesión, y más. "
                "Por favor, responde las preguntas en español si el usuario lo hace en español. Si el mensaje es incoherente, responde con: 'Hola, parece que estás confundido, ¿en qué puedo ayudarte?'\n"
            )
        else:
            context = (
                "You are a virtual assistant for Ticketmax.mx, a ticketing platform for events in Mexico. "
                "Users may ask about events, ticket availability, login issues, and more. Please respond in the language of the user's query. "
                "If the message is incoherent, reply with: 'Hello, it seems you're confused, how can I assist you?'\n"
            )

        # Verificar si el mensaje está vacío o no tiene suficiente contexto
        if len(input_text.strip()) < 3:
            return "Hola, parece que tu mensaje está incompleto. ¿En qué puedo ayudarte?"

        # Agregar información sobre el evento si se pregunta por él
        if "evento" in input_text.lower():
            event_info = get_event_info()
            input_text += f"\n\nInformación sobre el evento de prueba:\n{event_info}"

        # Combinamos el contexto con el mensaje del usuario
        full_input = context + "Usuario: " + input_text + "\nAsistente:"
        
        # Tokeniza la entrada
        inputs = tokenizer(full_input, return_tensors="pt")

        # Crea la máscara de atención
        attention_mask = torch.ones(inputs["input_ids"].shape, device=inputs["input_ids"].device)

        # Genera la respuesta
        outputs = model.generate(
            inputs["input_ids"],
            max_new_tokens=100,  # Generamos 100 tokens adicionales
            num_return_sequences=1,
            no_repeat_ngram_size=2,
            temperature=0.7,  # Controla la aleatoriedad de la respuesta
            top_p=0.95,  # Filtra los tokens más probables
            pad_token_id=tokenizer.pad_token_id,  # Configura el token de relleno
            attention_mask=attention_mask
        )
        
        # Decodifica y devuelve el texto generado
        response = tokenizer.decode(outputs[0], skip_special_tokens=True)
        
        # Si la respuesta es incoherente o contiene código, se corrige
        if "confundido" in response or "ayuda" in response or "include" in response or "#include" in response:
            return "Hola, parece que estás confundido, ¿en qué puedo ayudarte?"
        
        return response

    except Exception as e:
        return f"Error al generar la respuesta: {str(e)}"

if __name__ == "__main__":
    print("Bienvenido al asistente virtual de Ticketmax.mx.")
    print("Escribe tu pregunta o 'salir' para terminar.")
    
    try:
        while True:
            input_text = input("Usuario: ")  # Leer entrada del usuario
            if input_text.lower() in ["salir", "exit"]:
                print("Gracias por usar el asistente virtual. ¡Hasta luego!")
                break
            
            response = generate_response(input_text)
            print(f"Asistente: {response}")
    except KeyboardInterrupt:
        print("\nAsistente finalizado. ¡Hasta luego!")