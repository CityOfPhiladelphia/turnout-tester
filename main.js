var fs = require('fs'),
     csv = require('fast-csv');
     
var FILENAME_IN = 'turnout.csv',
     totals = 0,
     i = 0;

fs.createReadStream(FILENAME_IN)
.pipe(csv({
	headers: true,
	ignoreEmpty: false
}))
.on('data', function(row) {
     i++;
     // If party col contains a number (which means it's not a party but the totals)
     if(/\d/.test(row['Political Party'])) {
          // Test row format
          if( ! isTotalsFormat(row['Political Party'] || ! isNumericAndNotEmpty(row['Count of Voters by Party']))) {
               console.log(i +'|Format Issue|'+ row['Political Party'] +'|'+ row['Count of Voters by Party']);
          }
          if(totals != row['Count of Voters by Party']) {
               console.log(i +'|Totals Issue|'+ row['Political Party'] + '|' + row['Count of Voters by Party']);
          }
          totals = 0;
     } else if(isNumericAndNotEmpty(row['Count of Voters by Party'])) {
          totals += +row['Count of Voters by Party'];
     }
})
.on('end', function() {
     console.log('Done');
});

var isTotalsFormat = function(text) {
     return /Count of Voters in \d\d\d\d:/.test(text);
};

var isNumericAndNotEmpty = function(text) {
     return ! isNaN(text) && text.trim();
};