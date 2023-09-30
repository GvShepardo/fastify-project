// models/data.js

const fs = require('fs/promises');

const jsonFilePath = 'db.json'; // percorso del file JSON

// Funzione per leggere il file JSON
const readJSONFile = async () => {
    try {
        const data = await fs.readFile(jsonFilePath, 'utf8');
        return JSON.parse(data);
    } catch (error) {
        throw error;
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

const getData = async (username,key) => {
    try {
        const file = await readJSONFile();
        const user = file.users.find((user) => user.username === username);
        if(!user){
            return 500;
        }
        const desiredData = user.content.find((data) => data.key === key);
        return desiredData;
    } catch (error) {
        console.log(error);
    }
};

const createData = async (username,newData) => {
    try {
        let file = await readJSONFile();

        const index = file.users.findIndex((user) => user.username === username);
        if (index >= 0) {
            file.users[index].content.push(newData);
            await writeJSONFile(file);
            return {newData};
        }
        else
            return 500;
    } catch (error) {
        console.log(error);
    }
};

const patchData = async (username, key, body) => {
    try {
        const file = await readJSONFile();
        let userIndex = file.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return 500;
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

const deleteData = async (username,key) => {
    try {
        const file = await readJSONFile();
        let userIndex = file.users.findIndex((user) => user.username === username);
        if (userIndex === -1) {
            return 500;
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