require('dotenv').config();
const express = require('express');
const cors = require('cors');
const routes = require('./routes');

const app = express();
app.use(cors({
  origin: '*' 
}));
app.use(express.json());
app.use('/api', routes);

// Serve uploaded files
app.use('/uploads', express.static(__dirname + '/uploads'));

const PORT = process.env.PORT || 4000;
app.listen(PORT, () => console.log(`Backend running on port ${PORT}`));
