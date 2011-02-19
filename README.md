
## Datastore Types
<pre>
kv
    .{get,set,del}

jv
    like kv, but the keys get <a href="http://keyjson.org">keyjson</a> {en,de}coded

big_{k,j}v
    like {k,j}v, but also with .{get,set}Big
    Example: S3
    Example: jvr with a chunking/unchunking wrapper

{k,j}vr
    like {k,j}v, but also with {get,set}{,Big}Range
    Examples: Tokyo Tyrant, Cassandra

redis
    offers everything that Redis 2.2 does
    behaves like mranney's [node_redis](TODO)
    Example: Redis 2.2
</pre>


## Functions
<pre>
Conventions:
    
    v: (Buffer) or (unicode string to be UTF-8 encoded)
    k:
        for {kv,kvr,big_kv}: see v
        for j*: any <a href="http://keyjson.org">keyjson</a>-supported value

.get k
.set k, v
.del k

req = .getBig(k)      req.on {data,end}
req = .setBig(k)      req.{write,end}

.getRange: TODO
.setRange: TODO
.getBigRange: TODO
.setBigRange: TODO

.incr(k)
.incrby(k, n)
.decr(k)
.decrby(k, n)
...

</pre>


## Datastore Wrappers

### WrapRedis(redis\_conn, {prefix: null, key\_parse: null, key\_stringify: null})

* Redis via mranney's [node_redis](TODO)
