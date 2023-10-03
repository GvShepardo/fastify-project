const fastify = require('fastify')({
    logger: true
})


//router
fastify.register(require('./routes/user'));
fastify.register(require('./routes/data'));


// Run the server!
try {
        fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}
module.exports = fastify;