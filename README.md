# MuscleMate-Frontend

## Requisitos previos

Asegúrate de tener Node.js y npm instalados antes de comenzar.

- [Node.js](https://nodejs.org/)

## Instalación

1. Clona este repositorio:

   ```bash
   git clone https://github.com/ISPP-23-24-Grupo-3/musclemate-frontend.git
   ```

2. Accede al directorio donde has clonado tu proyecto

   ```bash
   cd musclemate-frontend
   ```

3. Instalar los paquetes requeridos

   ```bash
   npm install
   ```

4. Una vez instalado todos los requisitos necesarios, inicializamos el proyecto en modo desarrollo:
   ```bash
   npm run dev
   ```

Para acceder a la aplicación, visita http://localhost:5174/

# Despliegue en Docker

Dentro de la carpeta del proyecto, crea la imagen:

```bash
    docker build -t ispp-frontend .
```

Ejecuta la imagen y mapea el puerto para poder acceder a la aplicación:

```bash
    docker run -dp 8000:8000 ispp-frontend
```

## Con Docker Compose

Intencionado para su uso con el Front End.
Deberás configurar un directorio de la siguiente manera:

```
    .
    ├── docker-compose.yaml
    ├── musclemate-backend
    └── musclemate-frontend
```

El fichero docker-compose.yaml se encuentra inicialmente dentro de musclemate-frontend.

A continuación, desde el directorio con el fichero `docker-compose.yaml`, ejecuta:

```bash
    docker compose up -d
```

Tras hacer esto, se desplegarán:

- Una base de datos
- El proyecto de backend conectado a la base de datos
- El proyecto de frontend conectado al backend

La carpeta `src` del proyecto de frontend se montará como volumen dentro de su contenedor, de manera que al realizar cambios, se actualizarán en tiempo real.
