require('dotenv').config();
const cors = require('cors');
const express = require('express');
const mongoose = require('mongoose');

const port = process.env.PORT || 4000;

console.log(process.env.DATABASE_URL);

mongoose
  .connect(process.env.DATABASE_URL)
  .then(() => console.log("MONGODB_CONNECTED"))
  .catch((err) => console.log(err));


const app = express();
app.use(cors())
app.use(express.json());

const routes = require('./routes/routes');

app.use('/api', routes)

app.listen(4000, () => {
    console.log(`Server Started at ${4000}`)
})