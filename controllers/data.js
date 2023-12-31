const dataModel = require('../models/data');
// Crea un nuovi dati
const newData = async (request, reply) => {
    const newData = request.body;
    //Check se body contiene campo key
    if(!newData.key || newData.key === ""){
        reply.statusCode = 400;
        reply.send({status:400,message:"Chiave non specificata"});
        return;
    }

    let email = request.user.email;
    //Check se body contiene campo email(caso in cui Admin accede ai dati di un utente)
    if(request.body.email) {
        if (request.user.type === "admin") {
            email = request.body.email;
        }
        else{
            reply.statusCode = 403;
            reply.send({status: 403, message: "User non e' Admin"});
            return;
        }
    }

    //Chiama dataModel.createData per creare un dato nel db.json
    const createdData = await dataModel.createData(email, {key: newData.key, data: newData.data});
    if(createdData === 404){
        reply.statusCode = 404;
        reply.send({status: 404, message:"Utente non trovato"});
    }
    else if(createdData === 400) {
        reply.statusCode = 400;
        reply.send({status:400,message:"Chiave presente"});
    }
    else if(createdData.status){
        reply.statusCode = 500;
        reply.send(createdData);
    }
    else{
        reply.statusCode = 201;
        reply.send(createdData);
    }
};

//Cancella un dato
const deleteData = async (request, reply) => {
    const key = request.params.key;
    let email = request.user.email;

    //Check se query contiene campo email(caso in cui Admin accede ai dati di un utente)
    if(request.query.email) {
        if (request.user.type === "admin") {
            email = request.query.email;
        }
        else{
            reply.statusCode = 403;
            reply.send({status: 403, message: "User non e' admin"});
            return;
        }
    }

    //Chiama dataModel.deleteData per cancellare un dato nel db.json
    const result = await dataModel.deleteData(email,key);
    if(result === 404) {
        reply.statusCode = 404;
        reply.send({status: 404, message:"Utente non trovato"})
    }
    else if(result){
        if(result.hasOwnProperty('status')){
            reply.statusCode = 500;
            reply.send(result);
        }
        else {
            reply.statusCode = 200;
            reply.send(result);
        }
    }
    else {
        reply.statusCode = 404;
        reply.send({status: 404, message: "Chiave non trovata"});
    }
};
const getData = async (request, reply) => {
    const key = request.params.key;
    let email = request.user.email;

    //Check se query contiene campo email(caso in cui Admin accede ai dati di un utente)
    if(request.query.email) {
        if (request.user.type === "admin") {
            email = request.query.email;
        }
        else{
            reply.statusCode = 403;
            reply.send({status:403, message:"User non e' admin"});
            return;
        }
    }

    //Chiama dataModel.getData per accedere a un dato nel db.json
    const result = await dataModel.getData(email,key);
    if(result === 404) {
        reply.statusCode = 404;
        reply.send({status: 404, message:"Utente non trovato"})
    }
    else if(result){
        if(result.hasOwnProperty('status')){
            reply.statusCode = 500;
            reply.send(result);
        }
        else {
            reply.statusCode = 200;
            reply.send(result);
        }
    }
    else {
        reply.statusCode = 404;
        reply.send({status: 404, message: "Chiave non presente"})
    }
};

const patchData = async (request,reply) => {
    const key = request.params.key;
    const body = request.body;
    let email = request.user.email;

    //Check se body contiene campo email(caso in cui Admin accede ai dati di un utente)
    if (request.body.email) {
        if (request.user.type === "admin") {
            email = request.body.email;
        } else {
            reply.statusCode = 403;
            reply.send({status: 403, message: "User non e' Admin"})
            return;
        }
    }

    //Chiama dataModel.patchData per modificare un dato nel db.json
    const result = await dataModel.patchData(email, key, body);
    if (result === 404) {
        reply.statusCode = 404;
        reply.send({status: 404, message: "Utente non trovato"})
    }
    else if (result) {
        if(result.hasOwnProperty('status')){
            reply.statusCode = 500;
            reply.send(result);
        }
        else {
            reply.statusCode = 200;
            reply.send(result);
        }
    }
    else {
        reply.statusCode = 404;
        reply.send({status: 404, message: "Chiave non presente"})
    }
}


module.exports = {
    newData,
    getData,
    deleteData,
    patchData
};
