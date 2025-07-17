require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');
const urlRoute = require('./routes/url');

const app = express();
const port = parseInt(process.env.port, 10) || 3001;
const mongo_url = process.env.MONGO_URL;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.set('view engine', 'jade');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'views')));

app.use('/api', urlRoute); // Mount routes at /api for consistency

app.get('/', async (req, res) => {
  const Url = require('./model/url');
  const history = await Url.find().sort({ _id: -1 });
  res.render('index', {
    shortUrl: null,
    error: null,
    history,
    port
  });
});

async function startServer() {
  try {
    console.log("MONGO_URL:", mongo_url);
    await mongoose.connect(mongo_url);
    console.log('MongoDB connected successfully');
    if (process.env.NODE_ENV !== 'production') {
      app.listen(port, () => {
        console.log(`Server started at ${port}`);
      });
    }
  } catch (err) {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  }
}

startServer();

// Export for Vercel
module.exports = app;