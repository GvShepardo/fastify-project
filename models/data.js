const fs = require('fs/promises');

const jsonFilePath = 'db.json'; // percorso del file JSON

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
        throw error;
    }
};

const getData = async (email,key) => {
    try {
        const file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        const user = file.users.find((user) => user.email === email);
        if(!user){
            return 404;
        }
        const desiredData = user.content.find((data) => data.key === key);
        return desiredData;
    } catch (error) {
        console.log(error);
    }
};

const createData = async (email,newData) => {
    try {
        let file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        const key = newData.key;
        const index = file.users.findIndex((user) => user.email === email);
        if (index >= 0) {
            if (!file.users[index].content.find((data) => data.key === key)) {
                file.users[index].content.push(newData);
                await writeJSONFile(file);
                return {newData};
            } else
                return 400;
        } else
            return 404;
    } catch (error) {
        console.log(error);
    }
};

const patchData = async (email, key, body) => {
    try {
        const file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        let userIndex = file.users.findIndex((user) => user.email === email);
        if (userIndex === -1) {
            return 404;
        }
        console.log(userIndex);
        let dataIndex = file.users[userIndex].content.findIndex((data) => data.key === key);
        if (dataIndex === -1) {
            return;
        }
        console.log(dataIndex)
        file.users[userIndex].content[dataIndex].data = body.data;
        const updatedEntry = file.users[userIndex].content[dataIndex];
        console.log(updatedEntry)
        await writeJSONFile(file);
        return updatedEntry;
    } catch (error) {
        console.log(error);
    }
};

const deleteData = async (email,key) => {
    try {
        const file = await readJSONFile();
        if(file.status === 500){
            return file;
        }
        let userIndex = file.users.findIndex((user) => user.email === email);
        if (userIndex === -1) {
            return 404;
        }
        let dataIndex = file.users[userIndex].content.findIndex((data) => data.key === key);
        if (dataIndex === -1) {
            return;
        }
        const deletedEntry = file.users[userIndex].content[dataIndex];
        file.users[userIndex].content.splice(dataIndex, 1);
        await writeJSONFile(file);
        return deletedEntry;
    } catch (error) {
        console.log(error);
    }
};

module.exports = {
    getData,
    createData,
    patchData,
    deleteData
};
