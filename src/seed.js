const mongoose = require('mongoose');
const teams = require('./teams.json');
const Team = require('./models/Team');

mongoose
  .connect('mongodb://localhost/clase10', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(async () => {
    console.log('Base de datos lista para recibir conexiones');
    return mongoose.connection.db.dropDatabase();
  })
  .then(() => {
    return Team.insertMany(teams);
  })
  .then((docs) => {
    console.log(`Se guardaron ${docs.length} equipos en la base de datos`);
  })
  .catch(console.error)
  .finally(() => {
    mongoose.connection.close();
  });
