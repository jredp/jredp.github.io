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
app.set('port', 43575);

/*---------------------------------------*/
//          DEFAULT Get
/*---------------------------------------*/

app.get('/', function(req,res,next) {
  var context = {};
  var query = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, lbs FROM workouts"
  //Grab every row from the workouts table
  mysql.pool.query(query, function(err, rows, fields){
    if(err){
      console.log("Error: " + err);
      return;
    }    
    context.results = rows;
    if(!rows) {
      context.message = "You have no exercise data!";  
    }        
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
      lbs: req.body.lbs        
  };      
  mysql.pool.query('INSERT INTO workouts SET ?', payload, function(err, results) {            
      if (err) {
        console.log("INSERT err: " + err);
        return;
      }      
      payload.id = results.insertId; //Get the inserted ID - mySQL
      payload.message = ("Inserted to SQL with ID of: " + results.insertId);
      console.log(JSON.stringify(payload));
      res.send(JSON.stringify(payload)); //Send JSON STRING
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
  mysql.pool.query('DELETE from workouts WHERE id=?', payload.id, function(err, results) {
    if (err) {
      console.log("Error: " + err);
      return;
    }        
    console.log(JSON.stringify(payload));
    payload.message = ("Affected Rows: " + results.affectedRows + "      Deleted Row Item SQL ID: " + payload.id);
    res.send(JSON.stringify(payload)); //Send JSON STRING
  });      
});

/*---------------------------------------*/
//             EDIT Page
/*---------------------------------------*/

//Sends to edit page
app.get('/edit', function(req, res) {
    var context = {};
    var query = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, lbs FROM workouts WHERE id=?";
    mysql.pool.query(query, [req.query.id], function(err, rows, fields) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        context.results = rows;                
        console.log("Current update row text: " + JSON.stringify(context.results));
        res.render('edit', context);
    });
});

/*---------------------------------------*/
//         UPDATE via AJAX req
/*---------------------------------------*/

app.post('/update', function(req, res) {
    var context = {};
    var lbs;    
    if(req.body.lbs) { req.body.lbs=1; }
    else { req.body.lbs=0; }  
    var queryValid = "SELECT id, name, reps, weight, date_format(date, '%Y-%m-%d') AS mydate, lbs FROM workouts WHERE id=?";
    mysql.pool.query(queryValid, [req.body.id], function(err, rows, fields) {
        if (err) {
            console.log("Error: " + err);
            return;
        }
        var validate = {};
        validate.results = rows;
        var curVals = validate.results[0];
        mysql.pool.query('UPDATE workouts SET name=?, reps=?, weight=?, date=?, lbs=? WHERE id=?', 
        [req.body.name || curVals.name, req.body.reps || curVals.reps, req.body.weight || curVals.weight, req.body.date || curVals.date, req.body.lbs, req.body.id],
          function(err, results) {
            if (err) {
              console.log("Error: " + err);
              return;
            }
            console.log(results);
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
  mysql.pool.query("DROP TABLE IF EXISTS workouts", function(err) {
    var createString = 
      "CREATE TABLE workouts ("+
      "id INT(11) NOT NULL AUTO_INCREMENT,"+
      "name VARCHAR(255) NOT NULL,"+
      "reps INT(11),"+
      "weight INT(11),"+
      "date DATE,"+
      "lbs BOOL,"+
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