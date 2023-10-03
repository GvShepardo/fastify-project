// controllers/user.js
const fastify = require('fastify')({
    logger: true
})
const userModel = require('../models/user');
const crypto = require('crypto');
const fastifyCookie = require('fastify-cookie');
const {generateToken} = require("../tokenMiddleware");

fastify.register(fastifyCookie, {
    secret: 'cookiesecret', // Chiave segreta per firmare i cookie
    httpOnly: true, // Imposta su true per abilitare i cookie HttpOnly
});

const loginUser = async (request, reply) => {
    const email = request.body.email;
    const hashedPassword = hashPassword(request.body.password);
    // Logica per creare un nuovo utente nel modello
    const user = await userModel.getUserByName(email);
    if(user){
        const isCorrect  = crypto.timingSafeEqual(Buffer.from(hashedPassword),Buffer.from(user.password));
        if(isCorrect){
            reply.statusCode = 200;
            reply.header('Set-Cookie', `token=${generateToken({email:user.email,type:user.type})}; HttpOnly; Path=/; Max-Age=3600`);
            reply.send();
        }
        else{
            reply.statusCode = 400;
            reply.send({status:400,message:"incorrect password"});
        }
    }
    else{
        reply.statusCode = 404;
        reply.send({status:404,message:"user not found"});
    }
};

// Crea un nuovo utente
const createUser = async (request, reply) => {
    const newUser = request.body;
    const emailRegex = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if(!emailRegex.test(newUser.email)){
        reply.statusCode = 400;
        reply.send({status:400,message:"Email non valida"});
    }
    else {
        const createdUser = await userModel.createUser({
            email: newUser.email,
            password: hashPassword(newUser.password),
            type: "user"
        });
        if (createdUser !== 400) {
            if (createdUser) {
                reply.statusCode = 201;
                reply.send(createdUser);
            }
        } else {
            reply.statusCode = 400;
            reply.send({status: 400, message: "User esistente"})
        }
    }
};

// Cancella un utente
const deleteUser = async (request, reply) => {
    // Logica per cancellare un utente dal modello
    const user = request.user;
    const result = await userModel.deleteUser(user.email);
    console.log(result);
    if(result !== 500) {
        if (result) {
            reply.statusCode = 204;
            reply.header('Set-Cookie', `token=; HttpOnly; Path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT;`);
            reply.send();
        }
    }
    else{
        reply.statusCode = 500;
        reply.send({status: 500, message:"Utente non trovato"})
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
