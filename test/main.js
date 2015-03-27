var fs = require('fs');
var csv = require('fast-csv');
var test = require('tap').test;
     
var csvStream = fs.createReadStream('../turnout.csv')
  .pipe(csv({
    headers: true,
    ignoreEmpty: false
  }));

test('main', function (t) {
  var totals = 0;
  var i = 0;
  csvStream
    .on('data', function (row) {
      i++;
      // If party col contains a number (which means it's not a party but the totals)
      if (/\d/.test(row['Political Party'])) {
        // Test row format
        t.ok(isTotalsFormat(row['Political Party'] && !isNumericAndNotEmpty(row['Count of Voters by Party'])),
          i +'|Format Issue|'+ row['Political Party'] +'|'+ row['Count of Voters by Party']);
        t.ok(totals === row['Count of Voters by Party'],
          i +'|Totals Issue|'+ row['Political Party'] + '|' + row['Count of Voters by Party']);
        totals = 0;
      } else if (isNumericAndNotEmpty(row['Count of Voters by Party'])) {
        totals += +row['Count of Voters by Party'];
      }
    })
    .on('end', function () {
       t.end();
    });
});

function isTotalsFormat (text) {
  return /Count of Voters in \d\d\d\d:/.test(text);
}

function isNumericAndNotEmpty (text) {
  return !isNaN(text) && text.trim();
}
