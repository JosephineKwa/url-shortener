const mongoose = require('mongoose');
mongoose.connect(
    `mongodb://${process.env.DB_SERVER_ALIAS}:${process.env.DB_SERVER_PORT}/urlShortenerDB`,
    {
      reconnectTries: Number.MAX_VALUE,
      reconnectInterval: 1000
    });

const db = mongoose.connection;
db.on('error', (error) => {
  console.error(`Connection error: ${error}`);
  process.exit(1);
});
db.once('open', () => {
  console.log('Connected to mongoDb')
});