const express = require('express');
const todoController = require('./controllers/todoController'); 

let app = express();

// template engine
app.set('view engine', 'ejs');

// static files middleware
app.use(express.static('./public'));

// fire controller
todoController(app);

// listen to port
app.listen(3000);
console.log('you are listening to port 3000');