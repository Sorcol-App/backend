# backend
El repositorio backend será el punto central para el desarrollo de la lógica y funcionalidades del proyecto Sorcol. Contendrá el código fuente, configuraciones y cualquier recurso relacionado con la parte del servidor de la aplicación.

## Descripción del Proyecto

Sorcol es una plataforma educativa diseñada para enseñar lengua de señas colombiana de una manera interactiva y accesible. Nuestro objetivo es proporcionar una herramienta efectiva para aprender y practicar la lengua de señas, ayudando a promover la inclusión y la comunicación inclusiva.

## Tecnologías Utilizadas

- JavaScript
- Node.js
- Express
- MongoDB
- JSON Web Tokens (JWT)
- Bcrypt

## Instalación

Para ejecutar el proyecto localmente, sigue estos pasos:

1. Clona este repositorio en tu máquina local.
2. Asegúrate de tener Node.js instalado en tu sistema.
3. Ejecuta `npm install` en el directorio del proyecto para instalar las dependencias.
4. Configura las variables de entorno necesarias (por ejemplo, para la conexión a la base de datos MongoDB).
5. Ejecuta `npm start` para iniciar el servidor backend.

## Configuración de variables de entorno

Este proyecto utiliza variables de entorno para almacenar información sensible como credenciales de base de datos, tokens de API, etc. Para ejecutar la aplicación localmente, debes crear un archivo `.env` en la raíz del proyecto basado en el archivo `.env.example` proporcionado.

el archivo `.env` no debe ser comiteado debido a que contiene información sensible, utiliza `.gitignore` que se encarga de ignorar este archivo.


1. Copia el archivo `.env.example` y renómbralo a `.env`:

```bash
cp .env.example .env


