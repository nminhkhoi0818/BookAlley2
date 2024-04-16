require('dotenv').config();
const express = require('express');
const { default: mongoose } = require('mongoose');
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./config/database');
const errorHandler = require('./middleware/errorHandler');
const authentication = require('./middleware/authentication');
const APIRouter = require('./routes/api');
const corsOptions = require('./config/cors');
const app = express();
const port = process.env.PORT || 5000;

connectDB()
// Middleware
app.use(express.json())
app.use(express.urlencoded({extended: false}))
app.use(cookieParser());
app.use(cors(corsOptions));
// Error handler
app.use(errorHandler)
app.use(authentication)

app.use('/api', APIRouter);

app.all('*', (req, res) => {
  res.status(404)
  if (req.accepts('json')) res.json({'error': '404 Not Found'})
  else res.type('text').send('404 Not Found')
})

mongoose.connection.once('open', () => {
  console.log("Connected to DB")
  app.listen(port, () => console.log(`Server started on port ${port}`));
})