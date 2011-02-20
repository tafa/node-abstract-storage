
keyjson = require 'keyjson'

I = () -> 


encScore = (x) ->
  if (typeof x) == 'number'
    if x % 1 == 0
      '' + x
    else
      x.toPrecision 21
  else
    x


exports.RedisWrapper = class RedisWrapper
  
  constructor: (@conn, opt) ->
    opt = opt or {}
    prefix = opt.prefix or new Buffer ''
    if opt.keyjson
      @enc = (k) ->
        k = new Buffer k if k not instanceof Buffer
        withPrefix = new Buffer(prefix.length + k.length)
        prefix.copy withPrefix
        k.copy withPrefix, prefix.length
        keyjson.stringify withPrefix
    else
      @enc = (k) ->
        k = new Buffer k if k not instanceof Buffer
        withPrefix = new Buffer(prefix.length + k.length)
        prefix.copy withPrefix
        k.copy withPrefix, prefix.length
        withPrefix
  
  del: (k, c) ->    @conn.del @enc(k), (c or I)
  get: (k, c) ->    @conn.get @enc(k), (c or I)
  set: (k, v, c) -> @conn.set @enc(k), v, (c or I)
  incr: (k, c) ->   @conn.incr @enc(k), (c or I)
  
  zadd: (k, s, v, c) ->      @conn.zadd @enc(k), encScore(s), v, (c or I)
  zrem: (k, v, c) ->         @conn.zrem @enc(k), v, (c or I)
  zrevrange: (k, s, e, c) -> @conn.zrevrange @enc(k), s, e, (c or I)
  
  mget: (keys, c) -> @conn.mget (@enc(x) for x in keys), (c or I)
  
  mset: (interleaved, c) ->
    arr = []
    for i in [0...(interleaved.length / 2)]
      arr.push @enc interleaved[2 * i]
      arr.push interleaved[2 * i + 1]
    @conn.mset arr, (c or I)
