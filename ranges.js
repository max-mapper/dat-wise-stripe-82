var through = require('through2')
var qs = require('querystring')
var series = require('run-series')
var request = require('request')
var concat = require('concat-stream')
var ndjson = require('ndjson')

module.exports = function(hashes, datURL) {  
  hashes.sort()
  
  var ranges = hashes.map(function(hash, idx) {
    var last
    if (idx === 0) last = hash
    else last = next(hashes[idx - 1])
    return {
      gte: last,
      lt: next(hash)
    }
  })
  
  ranges = ranges.reduce(function(a, b) {
    // this stitches together adjacent ranges
    if(!a.length){
      return [b]
    }
    var prev = a[a.length - 1]
    if (prev.lt === de0(b.gte)) {
      prev.lt = b.lt
    } else {
      a.push(b)
    }
    return a
  }, [])
  
  var sum = 0
  
  var queries = ranges.map(function(range) {
    return function(done) {
      range.limit = -1
      var req = request(datURL + '/api/rows?' + qs.stringify(range))
      req.pipe(concat(function(rows) {
        var data = JSON.parse(rows)
        var len = data.rows.length
        sum += len
        if (len) console.log(range, len)
        done()
      }))
      req.on('error', done)
    }
  })
  
  series(queries, function(err) {
    if (err) throw err
    console.log('done', sum)
  })
}

function next(hash) {
  if (!hash.length) {
    return hash
  }
  var i = hash.length
  while (i--) {
    if (hash.charCodeAt(i) < 122) {
      return hash.slice(0,i ) + String.fromCharCode(hash.charCodeAt(i) + 1) + hash.slice(i + 1)
    } else if (hash.charCodeAt(i)===122) {
      hash = hash.slice(0, i)
    } else{
      throw new Error('invalid tile name')
    }
  }
}

function de0(a) {
  while (a.length) {
    if (a[a.length - 1] === '0') {
      a = a.slice(0, -1)
    } else {
      return a
    }
  }
  return a
}
