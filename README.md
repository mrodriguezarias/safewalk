# SafeWalk

## Integrantes

* Arce, Gerardo Gabriel
* Filgueira, Rocío Micol
* Luque, Lilian
* Rodríguez Arias, Mariano

## Preparación del entorno de desarrollo

1. Instalar la última versión de [Node.js](https://nodejs.org/)
2. Instalar Expo: `npm install expo-cli --global`
3. Instalar [Docker](https://www.docker.com/products/docker-desktop) o [MongoDB](https://www.mongodb.com/download-center/community)
4. Clonar el proyecto: `git clone git@github.com:gabriel-arce/ProyectoFinal.git`
5. Instalar las dependencias: `npm install`
6. Crear un archivo de configuración del entorno: `cp env/development.env env/local.env`

## Ejecución del entorno local

### Frontend (cliente)
`npm run app:start`

### Backend (servidor)
`npm run api:start`

### Panel de control

`npm run backend:start`

### Base de datos

* Con Docker: `docker-compose up -d`
* Sin Docker: `mongod --fork`

## Entornos de desarrollo, pruebas y producción

| Entorno    | Nombre | URL del panel de control y API | Nombre de la base de datos |
| ---------- | ------ | ------------------------------ | -------------------------- |
| Producción | prod   | http://safewalk1.herokuapp.com | safewalk1                  |
| Pruebas    | test   | http://safewalk2.herokuapp.com | safewalk2                  |
| Desarrollo | dev    | http://safewalk2.herokuapp.com | safewalk3                  |

### Base de datos

```mongodb+srv://root:h9I9mnkVtm9RESSRLg778oxgU7xIxaS7@sandbox-p1q7m.mongodb.net/safewalk?authSource=admin&replicaSet=Sandbox-shard-0&w=majority&readPreference=primary&appname=MongoDB%20Compass&retryWrites=true&ssl=true```

### Usuario administrador

Las credenciales del usuario administrador por defecto son:

| Nombre de usuario | Contraseña |
| ----------------- | ---------- |
| admin             | gamaroli   |
