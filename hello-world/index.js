var express = require('express');
var bodyParser = require('body-parser');
var Promise = require('bluebird');
var multer = require('multer');
var upload = multer(); 
var app = express();

app.use(bodyParser.json()); // for parsing application/json
app.use(bodyParser.urlencoded({ extended: true })); // for parsing application/x-www-form-urlencode
app.use(upload.array()); // for parsing multipart/form-data
app.use(express.static('public'));

app.set('view engine', 'pug');
app.set('views', './views');

app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.Promise = Promise;
mongoose.connect('mongodb://localhost/my_db');

var personSchema = mongoose.Schema({
    name: String,
    email: String,
    reviewer: String,
    client: String,
    industry: String
});

var Person = mongoose.model("Person", personSchema);
//defines schema for a person and defines mongoos model Person

var taskSchema = mongoose.Schema({
    clientEmail: String,
    taskURL: String,
    reviewerEmail: String,
    taskType: String
})

var Task = mongoose.model("Task", taskSchema);

/*
app.get('/person', function(req, res){
    res.render('person');
});
*/

app.get('/task', function(req, res) {
    res.render('task');
});

app.post('/task', bodyParser.urlencoded(), function(req, res) {
    console.log('task');
    var taskInfo = req.body;
    if (!taskInfo.clientEmail || !taskInfo.taskURL || !taskInfo.taskType) {
        res.render('show_message', {message: "Sorry, you did not provide all the info", type: "error"});
    } else {
        var newTask = new Task({
            clientEmail: taskInfo.clientEmail,
            taskURL: taskInfo.taskURL,
            reviewerEmail: taskInfo.reviewerEmail,
            taskType: taskInfo.taskType
        });
        console.log('saving a new task');
        newTask.save(function(err, result) {
            console.log('saved');
            if (err) {
                res.render('show_message', {message: "Database error", type: "error"});    
            } else {
                res.render('show_message', {message: "New person added", type: "success", task: taskInfo});
            }
        });
    }
})

app.get('/person', function(req, res){
    res.render('person');
});

app.post('/person',bodyParser.urlencoded(), function(req, res){
    console.log('person');
    var personInfo = req.body; //Get the parsed information
    if(!personInfo.name || !personInfo.email || !personInfo.reviewer || !personInfo.client || !personInfo.industry){
        res.render('show_message', {message: "Sorry, you provided wrong info", type: "error"});
    } else if (personInfo.reviewer != "no" && personInfo.reviewer != "yes") {
        res.render('show_message', {message: "Please input either yes or no as the reviewer field", type: "error"});
    } else if (personInfo.client != "no" && personInfo.client != "yes") {
        res.render('show_message', {message: "Please input either yes or no as the client field", type: "error"});
    }
    else{
        var newPerson = new Person({
            name: personInfo.name,
            email: personInfo.email,
            reviewer: personInfo.reviewer,
            client: personInfo.client,
            industry: personInfo.industry
        });
        console.log('saving');
        newPerson.save(function(err, result){
            console.log('saved');
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

app.get('/dashboard', function(req, res){
    res.render('dashboard');
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