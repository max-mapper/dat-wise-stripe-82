var NonTree = require('nontree')
var ndjson = require('ndjson')
var through = require('through2')

var nonTree = new NonTree({
  range: [-180, -90, 180, 90],
  precision: 10
})

process.stdin
  .pipe(ndjson.parse())
  .pipe(through.obj(
    function(obj, enc, next) {
      var id = obj.key
      obj.key = nonTree.encode([obj.dec, obj.ra]) + '-' + id
      this.push(obj)
      next()
    })
  )
  .pipe(ndjson.serialize())
  .pipe(process.stdout)