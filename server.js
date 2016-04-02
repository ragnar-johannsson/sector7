var Hapi = require('hapi');
var Good = require('good');
var inert = require('inert');
var redis = require('redis');
var client = redis.createClient(6379, 'redis');
var dns = require('dns');
var timestamp = Date.now();

var server = new Hapi.Server({
    connections: {
        routes: {
            files: {
                relativeTo: __dirname
            }
        }
    }
});
server.connection({ port: 80 });

server.route({
    method: 'GET',
    path:'/hello',
    handler: function (request, reply) {
        // Global rate limit - not all that cool
        if ((Date.now() - timestamp) < 10000) {
            server.log('info', 'Rate limiting');
            return reply('Not OK');
        }

        var ip = request.raw.req.connection.remoteAddress;

        dns.reverse(ip, function (err, hostnames) {
            var host = err || hostnames.length === 0 ? ip : hostnames.pop();
            client.incr(host);
        });

        timestamp = Date.now();
        reply('OK');
    }
});

server.route({
    method: 'GET',
    path:'/list',
    handler: function (request, reply) {
        client.keys('*', function (err, keys) {
            if (err) return console.log(err);

            client.mget(keys, function(err, values) {
                var sorted = [];

                for (var i = 0; i < keys.length; i++) {
                    sorted.push([
                        keys[i],
                        parseInt(values[i])
                    ]);
                }

                sorted.sort(function(a, b) { return b[1] - a[1]; });
                sorted.splice(0,0, ['Host', 'Number of breaches']);

                reply(sorted);
            });

        });
    }
});

server.route({
    method: 'GET',
    path:'/status',
    handler: function (request, reply) {
        reply.file('status.html');
    }
});

server.route({
    method: 'GET',
    path:'/',
    handler: function (request, reply) {
        reply.file("index.html");
    }
});

server.register([{
    register: inert
},{
    register: Good,
    options: {
        reporters: [{
            reporter: require('good-console'),
            events: {
                response: '*',
                log: '*'
            }
        }]
    }
}], function (err) {
    if (err) {
        throw err;
    }

    server.start(function (err) {
        server.log('info', 'Server running at: ' + server.info.uri);
    });
});
