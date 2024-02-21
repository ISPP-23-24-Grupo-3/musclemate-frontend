
Para organizar el proyecto seguiremos las siguiente estructura de carpetas:

```lua
|-- node_modules/
|-- public/
|   |-- index.html
|   |-- favicon.ico
|-- src/
|   |-- assets/
|   |   |-- images/
|   |   |-- other-assets/
|   |-- components/
|   |-- utils/
|   |   |-- api/
|   |   |-- functions/
|   |   |-- hooks/
|   |-- views/
|   |-- App.jsx
|   |-- index.jsx
|-- .gitignore
|-- package.json
|-- vite.config.js
```

- **assets**: Almacena archivos multimedia como imágenes, fuentes, etc.
    - **images**: Contiene las imágenes estáticas.
    - **other-assets**: Contiene cualquier archivos que no sea algún tipo de imagen.
- **components**: Contiene componentes React reutilizables.
- **utils**: Carpeta para utilidades y funciones auxiliares.
    - **api**:Contiene las funciones para conectarse al backend.
    - **functions**: Contiene las funciones para implementar algún tipo de lógica para no tenerlas presente en los componentes.
    - **hooks**: Contiene todos custom hooks.
- **views**: Contiene componentes que representan páginas completas o secciones grandes de la aplicación.
- **App.jsx**: El componente principal de la aplicación que agrupa todos los demás componentes.
- **main.jsx**: El punto de entrada de la aplicación donde se renderiza el componente principal.