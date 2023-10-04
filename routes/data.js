const dataController = require('../controllers/data');
const {verifyToken} = require("../tokenMiddleware");

const bodySchema = {
    type: 'object',
    properties: {
        email: { type:'string',format:'email' },
        key: { type: 'string'},
        data: { type: 'string',pattern:'^(?!\\s*$)(?:[a-zA-Z0-9+\\/]{4})*(?:|(?:[a-zA-Z0-9+\\/]{3}=)|(?:[a-zA-Z0-9+\\/]{2}==)|(?:[a-zA-Z0-9+\\/]{1}===))$'},
    },
    required: ['data'],
};

const paramsSchema = {
    type: 'object',
    properties: {
        key: { type: 'string' },
    },
    required: ['key'],
};

const querySchema = {
    type: 'object',
    properties: {
        email: { type: 'string', format:'email' }
    },
};

module.exports = function (fastify, opts, done) {
    fastify.post('/data', { preHandler: verifyToken, schema:{body:bodySchema}},dataController.newData);
    fastify.get('/data/:key', { preHandler: verifyToken, schema:{params:paramsSchema,query:querySchema}},dataController.getData);
    fastify.patch('/data/:key', { preHandler: verifyToken, schema:{params:paramsSchema,body:bodySchema} },dataController.patchData);
    fastify.delete('/data/:key', { preHandler: verifyToken, schema:{params:paramsSchema,query:querySchema}},dataController.deleteData);
    done();
};