
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
Documentación de cómo ejecutar el proyecto. (README.md) y Documento .doc

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
3a.- Instalar nodemon como dependencia de desarrollo para reiniciar el servidor automáticamente.
```bash
npm install --save-dev nodemon
```
3b.- Agregar los scripts de npm para ejecutar el servidor y activar la modularidad de la app.
```json
"type": "module",
  "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
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

## App File Structure 

sushi-bot/
│
├── backend/
│   ├── src/
│   │   ├── controllers/       # Lógica del bot y manejo de endpoints
│   │   │   ├── faqController.js       # Controlador de (FAQs)
│   │   │   ├── menuController.js       # Controlador de (menú y productos)
│   │   │   └── orderController.js       # controlador de (Órdenes)
│   │   ├── data/          # Datos de prueba para API
│   │   │   ├── example-data.json      # Datos de ejemplo (Productos y FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (Productos y FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (Productos y FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (menú y FAQs)
│   │   │   ├── example-data.json      # Datos de ejemplo (menú y FAQs)
│   │   │   └── example-data.json      # Datos de ejemplo (menú y FAQs)
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
