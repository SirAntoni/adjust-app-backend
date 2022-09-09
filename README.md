# Samishop API Backoffice v0 Dominios

## 🚀 Project Structure

Inside of your project, you'll see the following folders and files:

```css
/
├── src/
│   └── components/
│   └── routes/
│   └── utils/
│   └── app.js
│   └── db.js
├── .env.example
├── .gitignore
├── .nvmrc
├── index.js
├── package.json
├── README.md
```

## 🚀 Built With

<!-- This section should list any major frameworks that you built your project using. Here are a few examples.-->

- [Node.js](https://nodejs.dev/en/)
- [Express](https://expressjs.com/)
- [Helmet](https://helmetjs.github.io/)

### ⚒️ Pre Requisites

Node version 16

## 👾 Needed Config

- Copy `.env.example` to `.env` to extract data

### Variables de entorno explicadas:

- `NODE_ENV`: Entorno de ejecucion de Node.js. Ejemplo: `development`
- `MONGODB_URI`: URL para acceder a MongoDB. Ejemplo: `mongodb+srv://<user>:<password>@<url>/test?retryWrites=true&w=majority`
- `PORT`: Puerto del servicio. Ejemplo: `5000`
- `API_AUTH`: URL de para la autenticacion. Ejemplo: `https://api-autenticacion.samishop.pe/`
- `URL_CDN_STORAGE`: URL del storage. Ejemplo: `https://storage.googleapis.com/sspe-appv20-resources/`
- `DOMAIN_SYSTEM`: Dominio de Samishop. Ejemplo: `sami3.samishop.pe`
- `TOKEN_EXTERNAL`: Token de la API. Ejemplo: `$TOKEN_EXTERNAL`


## 📚 How to use

- Instalar dependencias.

  ```bash
  npm install --legacy-peer-deps
  ```

- Iniciar la Aplicacion.

  ```bash
  npm run dev
  ```

- Borrar sesion e iniciar la Aplicacion.

  ```bash
  npm run init
  ```

- Limpiar paquetes.

  ```bash
  npm run clean
  ```

- Limpiar carpeta de session.

  ```bash
  npm run clean-session
  ```

- Limpiar carpeta de los datos.

  ```bash
  npm run clean-data
  ```

- Limpiar paquetes, sessiones y los datos.

  ```bash
  npm run clean-all
  ```

### ⚒️ Utils Scripts

- Crear una nueva rama.

  ```bash
  git switch -c $branch
  ```

  $branch: development

- Agregar cambios al Staging Area (Cambios Locales).

  ```bash
  git add .
  ```

- Agregar comentario de la subida de los cambios.

  ```bash
  git commit -m 'test commit'
  ```

- Agregar cambios al Repositorio Remoto (Github).

  ```bash
  git push origin $branch
  ```

  $branch: development

- Listar cambios en el proyecto local.

  ```bash
  git status -s
  ```

- Actualizar cambios del proyecto.

  ```bash
  git pull origin main
  ```

- Volver a la rama principal.

  ```bash
  git switch main
  ```

- Fusionar los cambios realizados desde $branch a la rama main.

  ```bash
  git merge $branch
  ```

  $branch: development

- Listar cambios subidos en el repositorio remoto.

  ```bash
  git log --decorate --oneline --graph --all
  ```

- Definir la subida desde una rama principal.

  ```bash
  git push --set-upstream origin main
  ```
