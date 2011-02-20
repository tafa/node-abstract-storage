(function() {
  var I, RedisWrapper, encScore, keyjson;
  keyjson = require('keyjson');
  I = function() {};
  encScore = function(x) {
    if ((typeof x) === 'number') {
      if (x % 1 === 0) {
        return '' + x;
      } else {
        return x.toPrecision(21);
      }
    } else {
      return x;
    }
  };
  exports.RedisWrapper = RedisWrapper = (function() {
    function RedisWrapper(conn, opt) {
      var prefix;
      this.conn = conn;
      opt = opt || {};
      prefix = opt.prefix || new Buffer('');
      if (!(prefix instanceof Buffer)) {
        prefix = new Buffer(prefix);
      }
      if (opt.keyjson) {
        this.enc = function(k) {
          var withPrefix;
          if (!(k instanceof Buffer)) {
            k = new Buffer(k);
          }
          withPrefix = new Buffer(prefix.length + k.length);
          prefix.copy(withPrefix);
          k.copy(withPrefix, prefix.length);
          return keyjson.stringify(withPrefix);
        };
      } else {
        this.enc = function(k) {
          var withPrefix;
          if (!(k instanceof Buffer)) {
            k = new Buffer(k);
          }
          withPrefix = new Buffer(prefix.length + k.length);
          prefix.copy(withPrefix);
          k.copy(withPrefix, prefix.length);
          return withPrefix;
        };
      }
    }
    RedisWrapper.prototype.del = function(k, c) {
      return this.conn.del(this.enc(k), c || I);
    };
    RedisWrapper.prototype.get = function(k, c) {
      return this.conn.get(this.enc(k), c || I);
    };
    RedisWrapper.prototype.set = function(k, v, c) {
      return this.conn.set(this.enc(k), v, c || I);
    };
    RedisWrapper.prototype.incr = function(k, c) {
      return this.conn.incr(this.enc(k), c || I);
    };
    RedisWrapper.prototype.zadd = function(k, s, v, c) {
      return this.conn.zadd(this.enc(k), encScore(s), v, c || I);
    };
    RedisWrapper.prototype.zrem = function(k, v, c) {
      return this.conn.zrem(this.enc(k), v, c || I);
    };
    RedisWrapper.prototype.zrevrange = function(k, s, e, c) {
      return this.conn.zrevrange(this.enc(k), s, e, c || I);
    };
    RedisWrapper.prototype.mget = function(keys, c) {
      var x;
      return this.conn.mget((function() {
        var _i, _len, _results;
        _results = [];
        for (_i = 0, _len = keys.length; _i < _len; _i++) {
          x = keys[_i];
          _results.push(this.enc(x));
        }
        return _results;
      }).call(this), c || I);
    };
    RedisWrapper.prototype.mset = function(interleaved, c) {
      var arr, i, _ref;
      arr = [];
      for (i = 0, _ref = interleaved.length / 2; (0 <= _ref ? i < _ref : i > _ref); (0 <= _ref ? i += 1 : i -= 1)) {
        arr.push(this.enc(interleaved[2 * i]));
        arr.push(interleaved[2 * i + 1]);
      }
      return this.conn.mset(arr, c || I);
    };
    return RedisWrapper;
  })();
}).call(this);
