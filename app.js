const express = require('express');
const path= require('path');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));

app.use('/api/students', require('./routes/api/students'));

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));