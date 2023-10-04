const userController = require('../controllers/user');
const {verifyToken} = require("../tokenMiddleware");

const bodySchema = {
    type: 'object',
    properties: {
        email: { type: 'string' , format:'email'},
        password: { type: 'string' },
    },
    required: ['email', 'password'],
};

module.exports = function (fastify, opts, done) {
    fastify.post('/login', {schema:{body:bodySchema}},userController.loginUser);
    fastify.post('/register', {schema:{body:bodySchema}},userController.createUser);
    fastify.delete('/delete', { preHandler: verifyToken },userController.deleteUser);
    done();
};