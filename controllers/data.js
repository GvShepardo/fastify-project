// controllers/data.js
const dataModel = require('../models/data');
// Crea un nuovi dati
const newData = async (request, reply) => {
    const base64regex = /^([0-9a-zA-Z+/]{4})*(([0-9a-zA-Z+/]{2}==)|([0-9a-zA-Z+/]{3}=))?$/;
    const newData = request.body;
    // Logica per creare un nuovo utente nel modello
    if(base64regex.test(newData.data)) {
        const createdData = await dataModel.createData(request.user.username, {key: newData.key, data: newData.data});
        if (createdData !== 500) {
            reply.statusCode = 201;
            reply.send(createdData);
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
    const user = request.user;
    const key = request.params.key;
    const result = await dataModel.deleteData(user.username,key);
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
    const user = request.user;
    const key = request.params.key;
    const result = await dataModel.getData(user.username,key);
    console.log(result);
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
    const user = request.user;
    const key = request.params.key;
    const body = request.body;
    if(base64regex.test(body.data)) {
        const result = await dataModel.patchData(user.username, key, body);
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
