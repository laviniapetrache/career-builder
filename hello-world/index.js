var express = require('express');
var bodyParser = require('body-parser');
var multer = require('multer');
var upload = multer(); 
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencoded
app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/my_db');

var personSchema = mongoose.Schema({
    name: String,
    age: Number,
    nationality: String
});

var Person = mongoose.model("Person", personSchema);
//defines schema for a person and defines mongoos model Person


/*
app.get('/person', function(req, res){
    res.render('person');
});
*/

app.get('/person', function(req, res){
    res.render('person');
});

app.post('/person',bodyParser, function(req, res){
    var personInfo = req.body; //Get the parsed information
    if(!personInfo.name || !personInfo.age || !personInfo.nationality){
        res.render('show_message', {message: "Sorry, you provided worng info", type: "error"});
    }
    else{
        var newPerson = new Person({
            name: personInfo.name,
            age: personInfo.age,
            nationality: personInfo.nationality
        });
        newPerson.save(function(err, res){
            if(err)
                res.render('show_message', {message: "Database error", type: "error"});
            else
                res.render('show_message', {message: "New person added", type: "success", person: personInfo});
        });
    }
});

app.get('/components', function(req, res){
    res.render('main');
});


/*
app.post('/', function(req, res){
    console.log(req.body);
    res.send("recieved your request!");
});
*/

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