var mysql = require('mysql');

var pool = mysql.createPool({	
	connectionLimit : 10,
  	host            : 'localhost',
  	user            : 'admin',
  	password        : 'pass',
  	database        : 'osu'
});

module.exports.pool = pool;

/*
connectionLimit : 10,
	host            : 'mysql.cs.orst.edu',
	user            : 'cs290_parkinja',
	password        : 'TashaciMustang-2',
	database        : 'cs290_parkinja'
*/