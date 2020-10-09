const express = require('express');
const mongoose = require('mongoose');
const app = express();
const setRoutes = require('./routes');

const SERVER_PORT = 4000;
const MONGODB_CONNECTION = 'mongodb://localhost/clase10';

mongoose
  .connect(MONGODB_CONNECTION, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log('Base de datos lista');

    app.use(express.json());

    setRoutes(app);

    app.listen(SERVER_PORT, () => {
      console.log(
        `Servidor listo para recibir conexiones en http://localhost:${SERVER_PORT}`
      );
    });
  })
  .catch((error) => {
    console.error(error);

    mongoose.connection.close();
  });
