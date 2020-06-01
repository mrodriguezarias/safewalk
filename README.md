# ProyectoFinal

Nombre del Proyecto: SafeWalk

Integrantes:

- Arce, Gerardo Gabriel
- Filgueira, Rocío Micol
- Luque, Lilian
- Rodríguez Arias, Mariano

## Preparación del entorno de desarrollo

1. Instalar la última versión de [Node.js](https://nodejs.org/)
2. Instalar Expo: `npm install expo-cli --global`
3. Instalar [Docker](https://www.docker.com/products/docker-desktop) o [MongoDB](https://www.mongodb.com/download-center/community)
4. Clonar el proyecto: `git clone git@github.com:mrodriguezarias/safewalk.git`
5. Instalar las dependencias: `npm install`
6. Crear un archivo de configuración del entorno: `cp env/development.env env/local.env`

## Ejecución del entorno de desarrollo

### Frontend (cliente)

`npm run app:start`

### Backend (servidor)

`npm run api:start`

### Base de datos

- Con Docker: `docker-compose up -d`
- Sin Docker: `mongod --fork`
