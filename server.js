const fastify = require('fastify')({
    logger: true
})


//router
fastify.register(require('./routes/user'), { prefix: 'api/' });
fastify.register(require('./routes/data'), { prefix: 'api/' });


// Run the server!
try {
        fastify.listen({ port: 3000 })
} catch (err) {
    fastify.log.error(err)
    process.exit(1)
}