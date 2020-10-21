//BASIC APP REQUIREMENTS
var express = require('express');
var path = require('path');
var app = express();

//TEMPLATING ENGINE

//EXPRESS MIDDLEWARES
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public'))); //serve static files

//ROUTER
var router = require('./router');
app.use(router);

//RUN APP AT PORT defined in env or 3000 (locally)
var port = process.env.PORT || 3000;
app.listen(port);
console.log('Server is listening on port', port);
