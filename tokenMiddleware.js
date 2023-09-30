const jwt = require('jsonwebtoken');

const SECRET_KEY = 'supersecret'; // Sostituisci con una chiave segreta sicura

// Middleware per verificare il token JWT
const verifyToken = (request, reply, done) => {
    const token = request.headers.authorization;

    if (!token) {
        reply.status(401).send({ message: 'Token mancante' });
        return done(new Error('Token mancante'));
    }

    jwt.verify(token.replace('Bearer ', ''), SECRET_KEY, (err, decoded) => {
        if (err) {
            reply.status(403).send({ message: 'Token non valido' });
            return done(new Error('Token non valido'));
        }

        request.user = decoded;
        done();
    });
};

const generateToken = (data) => {
    return jwt.sign(data, SECRET_KEY, { expiresIn: '1h' });
};

module.exports = {verifyToken,generateToken};