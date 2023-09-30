const userController = require('../controllers/user');
const {verifyToken} = require("../tokenMiddleware");

module.exports = function (fastify, opts, done) {
    fastify.post('/login', userController.loginUser);
    fastify.post('/register', userController.createUser);
    fastify.delete('/delete', { preHandler: verifyToken },userController.deleteUser);
    done();
};