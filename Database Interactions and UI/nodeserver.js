/*-------------------------------------------*/
// Author: Jared Parkinson
// Mail: parkinja @ oregonstate . edu
// CS290 - Final Project
// MySQL Database Exercise Tracker
/*-------------------------------------------*/

/* https://piazza.com/class/itcfo5vjwjf79y?cid=231 Per this piazza post, I am using handlebars only on:
1. Initial page load
2. Update Form Screen load/return

This has been approved and I am using full AJAX for add/delete actions with DOM manipulation/JSON
response I have screenshots of answers if they change. */

/*---------------------------------------*/
//  express, mysql, bodyparser, handlebars
/*---------------------------------------*/

var express = require('express');
var mysql = require("./mysqldbcredlocal.js");
var app = express();
var bodyParser = require('body-parser');
var handlebars = require('express-handlebars').create({defaultLayout: 'main'});

app.use('/static', express.static('public'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
app.engine('handlebars', handlebars.engine);
app.set('view engine', 'handlebars');
app.set('port', 4400);

/*---------------------------------------*/
//          DEFAULT Get
/*---------------------------------------*/

app.get('/', function(req,res,next) {
  var context = {};
  var query = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, units FROM workouts2"
  //Grab every row from the workouts table
  mysql.pool.query(query, function(err, rows, fields){
    if(err){
      console.log("Error: " + err);
      return;
    }    
    context.results = rows;
    res.render('home', context);    
  });
});

/*---------------------------------------*/
//          INSERT via AJAX
/*---------------------------------------*/

app.post('/insert', function(req, res) {    
  var payload = {
      name: req.body.name,
      reps: req.body.reps,
      weight: req.body.weight,
      date: req.body.date,
      units: req.body.units        
  };      
  mysql.pool.query('INSERT INTO workouts2 SET ?', payload, function(err, results) {            
      if (err) {
        console.log("INSERT err: " + err);
        return;
      }      
      payload.id = results.insertId; //Get the inserted ID - mySQL      
      res.send(payload); //Send JSON
  });
});

/*---------------------------------------*/
//          DELETE via AJAX
/*---------------------------------------*/

//USES an AJAX JSON response as required!
app.post('/delete', function(req, res) {
  var payload = {
    id: req.body.id    
  };
  //if no errors, send delete command to client via JSON response
  if(!payload.id) {
    console.log("Error: " + err);
    return;
  }    
  //Delete from DB  
  mysql.pool.query('DELETE from workouts2 WHERE id=?', payload.id, function(err, results) {
    if (err) {
      console.log("Error: " + err);
      return;
    }    
    payload.deletedRows = results.affectedRows; //Set payload affected rows
    res.send(payload); //Send JSON
  });      
});

/*---------------------------------------*/
//             EDIT Page
/*---------------------------------------*/

//Sends to edit page
app.get('/edit', function(req, res) {
    var context = {};
    var query = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, units FROM workouts2 WHERE id=?";
    mysql.pool.query(query, [req.query.id], function(err, rows, fields) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        context.results = rows;
        //Check the box if lbs/kg boolean is true.        
        if (context.results[0].units === 1) {
            context.results[0].units = "true";
        }        
        console.log("Current text: " + (context.results));
        console.log("Current update object: " + JSON.stringify(context.results));        
        res.render('edit', context);
    });
});

/*---------------------------------------*/
//         UPDATE via AJAX
/*---------------------------------------*/

//USES an AJAX JSON response as required!
app.post('/update', function(req, res) {
    var context = {};        
    if(req.body.units) { req.body.units=1; }
    else { req.body.units=0; }    
    
    var queryValid = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, units FROM workouts2 WHERE id=?";
    mysql.pool.query(queryValid, [req.body.id], function(err, rows, fields) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        var validate = {};
        validate.results = rows;
        var curVals = validate.results[0];
        mysql.pool.query('UPDATE workouts2 SET name=?, reps=?, weight=?, date=?, units=? WHERE id=?', 
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.units, req.body.id],
          function(err, result) {
            if (err) {
              console.log("Error: " + err);
              return;
            }
            res.redirect('/');
        });
    });        
});

/*---------------------------------------*/
//          TABLE CLEAR
/*---------------------------------------*/

//DELETE the current table if exists on load
app.get('/reset-table', function(req,res,next) {
  var context = {};  
  console.log("Attempting Delete...");
  mysql.pool.query("DROP TABLE IF EXISTS workouts2", function(err) {
    var createString = 
      "CREATE TABLE workouts2 ("+
      "id INT(11) NOT NULL AUTO_INCREMENT,"+
      "name VARCHAR(255) NOT NULL,"+
      "reps INT(11),"+
      "weight INT(11),"+
      "date DATE,"+
      "units BOOL,"+
      "PRIMARY KEY (id)"+
      ") ENGINE=InnoDB DEFAULT CHARSET=utf8;";
      mysql.pool.query(createString, function(err) {
        context.message = "Table was NUKED!";
        res.render('home', context);
      })
  });
});

/*---------------------------------------*/
//          404 Not Found
/*---------------------------------------*/

app.use(function(req,res){
  res.status(404);
  res.render('404');
});

/*---------------------------------------*/
//          500 Something Wrong
/*---------------------------------------*/

app.use(function(err, req, res, next){
  console.error(err.stack);
  res.status(500);
  res.render('500');
});

/*---------------------------------------*/
//          Console Port Message
/*---------------------------------------*/

app.listen(app.get('port'), function(){
  console.log('Express started on port: ' + app.get('port') + ', press Ctrl-C to terminate.');
});