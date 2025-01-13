
Este proyecto está basado en el stack MERN (MongoDB, Express.js, React, Node.js) y requiere funcionalidades para un chatbot que tome pedidos de sushi, responda preguntas frecuentes y gestione pedidos.

1. Planificación del proyecto
Requisitos clave:

Mostrar el menú cuando se solicite.
Tomar pedidos básicos de sushi.
Responder preguntas frecuentes como "¿están abiertos?".

2. Tech Stack Obligatorio:
Node.js: Backend.
MongoDB: Almacén de productos y pedidos.
React: Interfaz de usuario.

3. Extras sugeridos:
Tests básicos.
Manejo robusto de errores.

4. Plazos:
Tres semanas.

5. Entregables:
Repositorio de GitHub con el código fuente.
Documentación de cómo ejecutar el proyecto. (README.md) y Documento .doc (https://docs.google.com/document/d/1lGrd1W0_PIgx2TbD3wmdn92UnoBYOpi5wItdQTWuRZ0/edit?usp=sharing) con el detalle de documentación de los endpoints , lóogica de la App, 

# Sushi Bot

## Crear projecto con Node.js y Express.js backend
1.- Crear un nuevo directorio para el proyecto de Node.js y Express.js
```bash
mkdir sushi-bot
cd sushi-bot
```
1a- Crear carpeta backend
```bash
mkdir backend
cd backend
```
2.- Inicializar un nuevo proyecto de Node.js
```bash
npm init -y
```
3.- Instalar Express.js y otras dependencias
```bash
npm install express cookie-parser dotenv mongoose socket.io
```
3a.- Instalar nodemon como dependencia de desarrollo para reiniciar el servidor automáticamente y mayor comodidad.
```bash
npm install --save-dev nodemon
```
3b.- Agregar los scripts de npm para ejecutar el servidor y activar la modularidad de la app.
```json
"type": "module",
  "scripts": {
    "test": "test",
    "start": "node index.js",
    "dev": "nodemon index.js"
  },
```
4.- Crear archivos app.js e index.js
5.- Crear un servidor Express
6.- Levantar el servidor en el puerto 3000
```bash
node start
```
7.- Crear un archivo .gitignore
8.- Crear un repositorio en GitHub
9.- Subir el proyecto a GitHub (desde la raiz del proyecto)
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

---

## Crear un proyecto de React frontend
1.- Crear una nueva carpeta para el proyecto de React
```bash
cd ..
mkdir frontend
cd frontend
```
2.- Inicializar un nuevo proyecto de React
```bash
npm create vite@latest  // options: Project Name: frontend, Framework: React with SW, Variant: JavaScript
``` 
3.- Instalar axios y dependencias para creacion del bot de chat
```bash
npm install axios socket.io-client semantic-ui-react react-scroll-to-buttom semantic-ui-css

```
4.- Crear un archivo .gitignore en la carpeta frontend
5.- Crear un repositorio en GitHub
6.- Subir el proyecto a GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```
7. Clonar el repositorio para ser utilizado y luego iniciar tanto Front como back en bash separados con npm start ó npm run dev
```bash
git clone https://github.com/ramonserranoprofile/Sushi-Bot.git
```

---

## App File Structure 
Esta estructura sigue una arquitectura monolítica modular.
```bash
sushi-bot/
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica del bot y manejo de endpoints
│   │   │   ├── faqController.js       # Controlador de (FAQs)
│   │   │   ├── menuController.js       # Controlador de (menú y productos)
│   │   │   └── orderController.js       # controlador de (Órdenes)
│   │   ├── data/          # Datos de prueba para API
│   │   │   ├── example-data.json      # Datos de ejemplo (Productos)
│   │   │   ├── example-data.json      # Datos de ejemplo (Productos)
│   │   │   ├── example-data.json      # Datos de ejemplo (FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (Orden)
│   │   │   └── example-data.json      # Datos de ejemplo (Orden)
│   │   ├── database/          # Coexión a MongoDB
│   │   ├── models/            # Modelos de MongoDB (Productos, Pedidos, Faqs)
│   │   │   ├── Faq.js      # Modelos de Datos (FAQs)
│   │   │   ├── Order.js      # Modelo de Datos (Órden)
│   │   │   └── Product.js      # Modelo de Datos (Producto)
│   │   ├── routes/            # Rutas de la API
│   │   │   ├── faqRoutes.js      # Datos de ejemplo (menú y FAQs)
│   │   │   ├── menuRoutes.js      # Datos de ejemplo (menú y FAQs)
│   │   │   └── orderRoutes.js      # Datos de ejemplo (menú y FAQs)
│   │   ├── services/          # Lógica adicional (e.g., validaciones)
│   │   ├── app.js            # Configuración de la funcionalidad de la app en el backend
│   │   ├── index.js          # Configuración del servidor Express
│   ├── tests/                 # Tests para el backend datos de prueba para ser usados en la API con Postman
│   │   ├── seed.js           # Script para cargar datos iniciales (Productos)
│   │   └── seed-FAQ.js       # Script para cargar datos iniciales (FAQs)
│   ├── package.json            # Dependencias y scripts de la aplicación
│   └── .env.example           # Variables de entorno necesarias
│
├── frontend/
│   ├── public/                 # Archivos públicos accesibles desde la raíz del servidor
│   │   ├── favicon.ico         # Ícono de la aplicación
│   │   └── manifest.json       # Archivo de configuración para aplicaciones web
│   ├── src/
│   │   ├── components/         # Componentes React
│   │   │   ├── Chat.jsx        # Componente de la interfaz de chat
│   │   │   └── ChatBot.jsx     # Componente del bot de chat
│   │   ├── services/           # Manejo de la API desde el frontend
│   │   ├── App.jsx             # Componente raíz del frontend
│   │   ├── main.jsx            # Archivo de entrada para la aplicación React
│   │   ├── App.css             # Estilos globales para el componente App
│   │   └── main.css            # Estilos globales para el archivo main.jsx
│   ├── tests/                  # Tests para el frontend
│   ├── .env.example            # Variables de entorno necesarias
│   ├── index.html              # Archivo HTML principal
│   ├── package.json            # Dependencias y scripts de la aplicación
│   ├── README.md               # Vite info
│   └── vite.config.js
├── README.md                   # Documentacíon de la aplicación
└── .gitignore
```
---

Mensajes de el Bot entiende: Aquí hay ejemplos de mensajes que entiende el bot, incluyendo las opciones específicas como indicar si estamos abierto o no, y el tiempo actual:


### **Ejemplos de mensajes que entiende el chat-bot:**

1. **Estado del restaurante (Horario y apertura):**
   - *"¿Están abiertos?"*  
     Respuesta: *"Nuestro horario de atención es de lunes a viernes de 12:00 PM a 10:00 PM, y los sábados de 1:00 PM a 11:00 PM, Domingos descansamos. La hora actual es ${hora_actual}. Estamos ${on_off}, ¡Esperamos tu visita!"*
   - *"¿A qué hora cierran hoy?"*  
     Respuesta: *"Hoy ${dia_semana} cerramos a las ${hora_cierre_hora}. ¡Esperamos tu visita!"*
   - *"¿Cuáles son los horarios del restaurante?"*  
     Respuesta: *"Abrimos de lunes a viernes de 12:00 PM a 10:00 PM, y los fines de semana: Sábados de 1:00 PM a 11:00 PM., Domingos descansamos. ¡Te esperamos!"*

2. **Ubicación del restaurante:**
   - *"¿Cuál es su dirección?"*  
     Respuesta: *"Nos encontramos ubicados en la Avenida Principal, número 123, en el centro de la ciudad. ¡Te esperamos!"*
   - *"¿Dónde están ubicados?"*  
     Respuesta: *"Estamos en la Avenida Principal, número 123, en el centro de la ciudad."*

3. **Opciones de menú y servicios:**
   - *"¿Tienen opciones vegetarianas?"*  
     Respuesta: *"¡Sí! Tenemos sushi vegetariano y platos como ensaladas, edamame y más."*
   - *"¿Hacen entregas a domicilio?"*  
     Respuesta: *"Sí, ofrecemos servicio de entrega a domicilio. Puedes ordenar a través de nuestra página web o apps como Uber Eats y Glovo."*
   - *"¿Tienen menú para niños?"*  
     Respuesta: *"Sí, ofrecemos un menú especial para niños con opciones suaves y sin picante."*

4. **Promociones y descuentos:**
   - *"¿Tienen promociones o descuentos?"*  
     Respuesta: *"Ofrecemos descuentos en pedidos grandes y promociones especiales durante la semana. Consulta nuestra página web o redes sociales para más información."*

5. **Reservas y eventos:**
   - *"¿Puedo hacer una reserva?"*  
     Respuesta: *"¡Claro! Puedes hacer una reserva llamándonos al número del restaurante o enviándonos un mensaje por WhatsApp."*
   - *"¿Ofrecen catering para eventos?"*  
     Respuesta: *"¡Sí! Contamos con servicio de catering para eventos pequeños y grandes. Contáctanos para más información."*

6. **Restricciones dietéticas:**
   - *"¿Tienen opciones sin gluten?"*  
     Respuesta: *"Sí, contamos con opciones sin gluten, como sushi con arroz especial y platos adaptados para celíacos."*
   - *"¿Ofrecen sushi sin pescado crudo?"*  
     Respuesta: *"¡Sí! Tenemos opciones como sushi de pollo, camarones cocidos y vegetales."*

7. **Tiempo estimado:**
   - *"¿Cuánto tarda un pedido para llevar?"*  
     Respuesta: *"El tiempo de preparación y envio promedio es de 15 a 25 minutos, dependiendo del tamaño del pedido."*

---

### **Notas clave sobre las respuestas:**
- El bot adapta las respuestas dinámicamente usando variables como:
  - `${hora_actual}` para mostrar la hora actual.
  - `${on_off}` para indicar si está abierto o cerrado según el horario.
  - `${dia_semana}` para especificar el día.
  - `${hora_cierre}` para el horario de cierre.
- Estas variables dependen de la lógica previamente configurada para calcular si el restaurante está abierto o cerrado.

---

### **Errores que se manejan en la App**

1. Manejo de Errores en las Rutas (Express.js)
Respuestas HTTP adecuadas: Utilizas códigos de estado HTTP apropiados para indicar distintos tipos de errores, como 400 para solicitudes incorrectas (por ejemplo, cuando los datos no tienen el formato adecuado) y 404 cuando no se encuentra el recurso solicitado.

2. Manejo de Errores de Base de Datos
Utilizas MongoDB con Mongoose y los errores son correctamente manejados mediante bloques try-catch para evitar que se caiga la aplicación. Además, usas un mensaje de error claro (error.message) al capturar cualquier excepción de la base de datos.

3. Validación de Entradas
En la creación y actualización de pedidos, validas la estructura de los datos (products y customerName). Si el formato no es correcto, devuelves un mensaje de error 400 Bad Request.

4. Manejo de Errores de API
Al realizar peticiones a la API, asegúrate de manejar adecuadamente los errores, como respuestas con códigos 400, 404, 500, etc. Deberías mostrar mensajes de error en la interfaz de usuario para que el usuario sepa lo que ocurrió (por ejemplo, si el pedido no se pudo crear o si hay productos no disponibles).

5. Manejo middlewares globales para manejar errores como 404 (recurso no encontrado), 400 (solicitud incorrecta) o 500 (Error Interno del Servidor)

---

### **Tests**

*Pruebas: Frontend*
Ubicado en folder /frontend

```bash
npm test
```

Integration test - Frontend to Backend communication over soket.io with 'Hello World' message emit - Result: message emited
Imtegration test - Communication with handshake waiting from client to server - Result: Success
Integration test - User Count > Debe actualizar el conteo de usuarios cuando se recibe el evento usersCount - Result: updated 
Unit test - Initial Render > should render the initial form with username and room input - Result: rendered
Unit test - should join the chat room when username is provided - Result 'Usuario: TestUser se unió a la sala GENERAL'

*Pruebas: Backend y DataBase*
Ubicado en folder /backend

```bash
npm test
```

Server Tests
Unit test - should get menu products JSON response with status '200' (GET '/menu') - Result: 200 -Pass
Unit test - should get orders data JSON response with status '200' (GET '/order') - Result 200 - Pass
Unit test - shoould get Faq data JSON response witd status 200 (GET '/faq') - Result 200 - Pass


MongoDB Tests
Integration Test - Should return error 400 and prevent creation of a document order in MongoDB when required fields are missing (POST '/order' without customerName in the request body). - Result: Error 400 and preventing MongoDB document order data creation.
Integration Test - Should create a MongoDB document for an order with products (POST '/order' with valid order data) - Result: status 200 and successfully saved the order as a document in MongoDB.