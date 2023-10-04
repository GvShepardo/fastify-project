// controllers/user.js
const userModel = require('../models/user');
const crypto = require('crypto');
const {generateToken} = require("../tokenMiddleware");

const loginUser = async (request, reply) => {
    const email = request.body.email;
    const hashedPassword = hashPassword(request.body.password);
    // Logica per creare un nuovo utente nel modello
    const user = await userModel.getUserByName(email);
    if(user){
        if(user.hasOwnProperty('status')){
            reply.statusCode = 500;
            reply.send(user);
        }
        else {
            const isCorrect = crypto.timingSafeEqual(Buffer.from(hashedPassword), Buffer.from(user.password));
            if (isCorrect) {
                reply.statusCode = 200;
                reply.header('Set-Cookie', `token=${generateToken({
                    email: user.email,
                    type: user.type
                })}; HttpOnly; Path=/; Max-Age=3600`);
                reply.send();
            } else {
                reply.statusCode = 400;
                reply.send({status: 400, message: "username o password errati"});
            }
        }
    }
    else{
        reply.statusCode = 400;
        reply.send({status:400,message:"username o password errati"});
    }
};

// Crea un nuovo utente
const createUser = async (request, reply) => {
    const newUser = request.body;
    const createdUser = await userModel.createUser({
        email: newUser.email,
        password: hashPassword(newUser.password),
        type: "user"
    });
    if (createdUser === 400) {
        reply.statusCode = 400;
        reply.send({status: 400, message: "User esistente"})
    } else if(createdUser){
        if (createdUser.hasOwnProperty('status')) {
            reply.statusCode = 500;
            reply.send(createdUser);
        }
        else{
            reply.statusCode = 201;
            reply.send(createdUser);
        }
    }
};

// Cancella un utente
const deleteUser = async (request, reply) => {
    // Logica per cancellare un utente dal modello
    const user = request.user;
    const result = await userModel.deleteUser(user.email);
    if (result) {
        if(result.hasOwnProperty('status')){
            reply.statusCode = 500;
            reply.send(result);
        }
        else {
            reply.statusCode = 204;
            reply.header('Set-Cookie', `token=; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
            reply.send();
        }
    }
    else{
        reply.statusCode = 404;
        reply.send({status: 404, message:"Utente non trovato"})
    }
};


// Funzione per generare l'hash SHA-256 di una password
function hashPassword(password) {
    const sha256 = crypto.createHash('sha256');
    sha256.update(password);
    return sha256.digest('hex');
}

module.exports = {
    loginUser,
    createUser,
    deleteUser,
};
