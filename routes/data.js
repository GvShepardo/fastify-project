const dataController = require('../controllers/data');
const {verifyToken} = require("../tokenMiddleware");

module.exports = function (fastify, opts, done) {
    fastify.post('/data', { preHandler: verifyToken },dataController.newData);
    fastify.get('/data/:key', { preHandler: verifyToken },dataController.getData);
    fastify.patch('/data/:key', { preHandler: verifyToken },dataController.patchData);
    fastify.delete('/data/:key', { preHandler: verifyToken },dataController.deleteData);
    done();
};