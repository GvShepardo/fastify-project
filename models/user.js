const fs = require('fs/promises');

const jsonFilePath = 'db.json'; // Il percorso del file JSON

// Funzione per leggere il file JSON
const readJSONFile = async () => {
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        console.log(error);
        return {status:500,error:error};
    }
};

// Funzione per scrivere nel file JSON
const writeJSONFile = async (data) => {
    try {
        await fs.writeFile(jsonFilePath, JSON.stringify(data, null, 2), 'utf8');
    } catch (error) {
        console.log(error);
        return {status:500,error:error};
    }
};
const getUserByName = async (name) => {
    try {
        const file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        const user = file.users.find((user) => user.email === name);
        return user;
    } catch (error) {
        console.log(error);
    }
};

const createUser = async (newData) => {
    try {
        let file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        const newUser = {
            email: newData.email,
            password: newData.password,
            type: newData.type,
            content: []
        };
        const index = file.users.findIndex((user) => user.email === newData.email);
        if (index === -1) {
            file.users.push(newUser);
            await writeJSONFile(file);
            return {email:newUser.email,type:newUser.type};
        }
        else
            return 400;
    } catch (error) {
        return 500;
    }
};

const deleteUser = async (email) => {
    try {
        const file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        const index = file.users.findIndex((user) => user.email === email);
        if (index === -1) {
            return 500;
        }
        const deletedUser = file.users[index];
        file.users.splice(index, 1);
        await writeJSONFile(file);
        return deletedUser;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getUserByName,
    createUser,
    deleteUser,
};
