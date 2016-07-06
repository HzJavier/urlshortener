var Util = {
  generateShort: function() {
    return Math.random().toString(36).slice(-6);
  },
  checkHashInDB: function(db, res, oldUrl, newUrl, success, fail) {
    var seed = Util.generateShort();
    db.collection('urls').findOne({ shortUrl: seed }, function(err, url){
      if (url === null) {
        return success(db, res, oldUrl, newUrl, seed);
      } else {
        return fail(db);
      }
    });
  },
  successCB: function(db, res, oldUrl, newUrl, seed) {
    console.log('2');
    db.collection('urls').insertOne({ "fullUrl" : oldUrl, "shortUrl" : seed, "count": 0 });
    db.close();
    res.send({ url: newUrl + seed });
    return;
  },
  failCB: function(db) {
    checkHashInDB(db, Util.successCB, Util.failCB);
  }
}

module.exports = Util;
