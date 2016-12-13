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
app.set('views', ['hello-world/views', './views']);

app.use(express.static('hello-world/public'));
app.use(express.static('public'));

var mongoose = require('mongoose');
mongoose.Promise = Promise;

mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost/my_db');

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
});

var Task = mongoose.model("Task", taskSchema);

// /task/david@yale.edu
/*code to find all tasks from the Task schema that have clientEmail=:clientEmail; 
to get all Tasks as such just leave get request url as '/task'*/
/*app.get('/task/:clientEmail', function (req, res) {
    Task.find({clientEmail: req.params.clientEmail}, function (err, tasks) {
        res.render('task', {email: tasks[0].reviewerEmail})
    });
});
*/
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
                Task.find(function (err, tasks) {
                    console.log(tasks);
                   if(err)
                        res.render('show_message', {message: "Database error", type: "error"});
                    else
                        res.render('dashboard', {data:tasks});
                    });
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
        Person.find(function(err, response){
        console.log(response);
        if(err)
                res.render('show_message', {message: "Database error", type: "error"});
            else
                //res.render('show_message', {message: "Information retrieved from database", type: "success", person: personInfo});    
                res.render('dashboard');
        });
    }
});

/*app.get('/dashboard', function (req, res) {
   Task.find({clientEmail: req.params.clientEmail}, function (err, tasks) {
       console.log(tasks);
       //res.render('', {email: tasks[0].reviewerEmail})
   });
});
*/

app.get('/dashboard', function (req, res) {
   Task.find(function (err, tasks) {
       console.log(tasks);
       if(err)
                res.render('show_message', {message: "Database error", type: "error"});
        else
       //res.json(tasks);
       //res.render('', {email: tasks[0].reviewerEmail})
            res.render('dashboard', {data:tasks});
   });
});

app.get('/viewpeople', function(req, res){
    Person.find(function(err, response){
        if(err)
                res.render('show_message', {message: "Database error", type: "error"});
            else
        res.json(response);
    });
});
//home page login
app.get('/', function(req, res){
    res.render('main');
});
/*
app.get('/dashboard', function(req, res){
    if (req.query.status) {
    
    }
    res.render('dashboard');
});
*/
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