# work in progress

notes:

- we only care about stripe 82:

```
306° < ra < 62°
-1.27° < dec < +1.27°
```

- the source data only comes sorted by dec, so we want to start with these two files:
  - http://irsadist.ipac.caltech.edu/wise-allwise/wise-allwise-cat-part25.gz - `-1.861900 < dec <= 0.746200`
  - http://irsadist.ipac.caltech.edu/wise-allwise/wise-allwise-cat-part26.gz - `0.746200 < dec <= 3.357000`

- then we want to import those two files into dat with a filter like this:
  - `-1.27° < dec < +1.27° && 306° < ra < 62`
  - then we know we only have data in stripe 82


- import scripts:

```
csv-parser 100k.csv --headers=$(cat columns.tsv) --separator="|" | jsonmap "{ra: +this.ra, dec: +this.dec, key: this.source_id}" | node index.js
```