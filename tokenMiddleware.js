const jwt = require('jsonwebtoken');

const SECRET_KEY = 'F75778F7425BE4DB0369D09AF37A6C2B9A83DEA0E53E7BD57412E4B060E607F7';

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