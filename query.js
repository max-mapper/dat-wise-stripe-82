var request = require('request')
var url = require('url')
var ndjson = require('ndjson')
var geohash = require('ngeohash')
var through = require('through2')
var Dat = require('dat')

var geohashQueryStream = require('./ranges')

var query = process.argv[2]
var precision = +(process.argv[3] || 3)
if (precision > 7) exit()
if (!query) exit()
var args = query.split(',')
if (args.length !== 4) exit()

// convert ra -> longitude
args[0] -= 180
args[2] -= 180

args.push(precision)
var hashes = geohash.bboxes.apply(null, args)
console.log('Querying', hashes.length, 'geohash regions')
var ranges = geohashQueryStream(hashes, 'http://localhost:6461')

function exit() {
  console.error('Usage: llRA,llDEC,urRA,urDEC <optional precision of 7 or lower>')
  process.exit(1)
}
