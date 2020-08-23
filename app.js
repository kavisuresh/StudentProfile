const express = require('express');
const path= require('path');
const exphbs = require('express-handlebars');

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true}));
app.engine('handlebars', exphbs({ defaultLayout : 'main'}));
app.set('view engine', 'handlebars');

app.use('/api/students', require('./routes/api/students'));

app.get('/', (req, res) => {
    res.render('home', { title: 'Student Information'});
})

app.use(express.static('public'));

const PORT = process.env.PORT || 8080;
app.listen(PORT,()=> console.log(`Server running on port ${PORT}`));