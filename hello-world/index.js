var express = require('express');
/*var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); */
var app = express();

app.set('view engine', 'pug');
app.set('views', './views');
/*
app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));

app.post('/', function(req, res){
    console.log(req.body);
    res.send("recieved your request!");
});
*/

app.use(express.static('public'));

app.get('/components', function(req, res){
    res.render('main');
});


/*var things = require('./things.js'); 
//both index.js and things.js should be in same directory
app.use('/things', things); 

app.get('/first_template', function(req, res){
    res.render('first_view');
});

app.get('/dynamic_view', function(req, res){
    res.render('dynamic', {
        name: "TutorialsPoint", 
        url:"http://www.tutorialspoint.com"
    });
   
});

app.get('/test/:name/:id', function(req, res){
    res.send('id: ' + req.params.id + ' and name: ' + req.params.name);
});
*/
app.listen(process.env.PORT);