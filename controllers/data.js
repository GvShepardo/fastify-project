// controllers/data.js
const dataModel = require('../models/data');
// Crea un nuovi dati
const newData = async (request, reply) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const newData = request.body;
    let email = request.user.email;
    if(request.body.email) {
        if (request.user.type === "admin") {
            email = request.body.email;
        }
        else{
            if(request.user.email !== request.body.email) {
                reply.statusCode = 403;
                reply.send({status: 403, message: "User non e' Admin"});
                return;
            }
        }
    }
    // Logica per creare un nuovo utente nel modello
    if(base64regex.test(newData.data) && newData.key) {
        const createdData = await dataModel.createData(email, {key: newData.key, data: newData.data});
        if (createdData !== 500) {
            if(createdData !== 400) {
                reply.statusCode = 201;
                reply.send(createdData);
            }
            else{
                reply.statusCode = 400;
                reply.send({status:400,message:"Chiave presente"});
            }
        }
        else{
            reply.statusCode = 500;
            reply.send({status: 500, message:"Utente non trovato"})
        }
    }
    else{
        reply.statusCode = 400;
        reply.send({status: 400, message:"Formato non corretto"})
    }
};

const deleteData = async (request, reply) => {
    // Logica per cancellare dati
    const key = request.params.key;
    let email = request.user.email;
    console.log(email);
    console.log(request.user.type);
    if(request.query.email) {
        if (request.user.type === "admin") {
            email = request.query.email;
        }
        else{
            if(request.user.email !== request.query.email) {
                reply.statusCode = 403;
                reply.send({status: 403, message: "User non e' admin"});
                return;
            }
        }
    }
    const result = await dataModel.deleteData(email,key);
    console.log(result);
    if(result !== 500) {
        if (result) {
            reply.statusCode = 200;
            reply.send(result);
        } else {
            reply.statusCode = 404;
            reply.send({status: 404, message: "Chiave non trovata"});
        }
    }
    else{
        reply.statusCode = 500;
        reply.send({status: 500, message:"Utente non trovato"})
    }
};
const getData = async (request, reply) => {
    const key = request.params.key;
    let email = request.user.email;
    if(request.query.email) {
        if (request.user.type === "admin") {
            email = request.query.email;
        }
        else{
            if(request.user.email !== request.query.email){
                reply.statusCode = 403;
                reply.send({status:403, message:"User non e' admin"});
            }
        }
    }
    const result = await dataModel.getData(email,key);
    if(result !== 500) {
        if (result) {
            reply.statusCode = 200;
            reply.send(result);
        } else {
            reply.statusCode = 404;
            reply.send({status: 404, message: "Chiave non presente"})
        }
    }
    else{
        reply.statusCode = 500;
        reply.send({status: 500, message:"Utente non trovato"})
    }

};

const patchData = async (request,reply) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const key = request.params.key;
    const body = request.body;
    let email = request.user.email;
    if(request.body.email) {
        if (request.user.type === "admin") {
            email = request.body.email;
        }
        else{
            if(request.user.email !== request.body.email) {
                reply.statusCode = 403;
                reply.send({status: 403, message: "User non e' Admin"})
                return;
            }
        }
    }
    if(base64regex.test(body.data)) {
        const result = await dataModel.patchData(email, key, body);
        if(result !== 500) {
            if (result) {
                reply.statusCode = 200;
                reply.send(result);
            } else {
                reply.statusCode = 404;
                reply.send({status: 404, message: "Chiave non trovata"});
            }
        }
        else{
            reply.statusCode = 500;
            reply.send({status: 500, message:"Utente non trovato"})
        }
    }
    else{
        reply.statusCode = 400;
        reply.send({status:400,message:"Formato non corretto"})
    }

}


module.exports = {
    newData,
    getData,
    deleteData,
    patchData
};
