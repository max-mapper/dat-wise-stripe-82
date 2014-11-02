var geohash = require('ngeohash')
var ndjson = require('ndjson')
var through = require('through2')
var Dat = require('dat')

var dat = Dat('./data', function(err) {
  if (err) throw err
  
  var bbs = geohash.bboxes(45.3550281, -1.3792853, 45.5066702, -1.3257992, 6)
  console.log(bbs)
})


// {"ra":45.3550281,"dec":-1.3792853,"key":"gbp408eshqÿ0453m016_ac51-029590","version":1}
