
# fastify-project

Applicazione basata su Fastify

## Clonare il Repository
    git clone https://github.com/GvShepardo/fastify-project.git

## Installare le Dipendenze

Dopo aver clonato il repository, entra nella directory del progetto e installa le dipendenze eseguendo:

    cd fastify-project
    npm install

## Avviare il Server

Per avviare il server Fastify, esegui il seguente comando:

    npm run start
    
Il server dovrebbe essere in esecuzione all'indirizzo http://localhost:3000

## Testare le API con Tap e light-my-request

Per eseguire i test delle API utilizzando Tap e light-my-request, assicurati che il server non sia attivo. Quindi esegui il seguente comando:

    npx tap server.test.js

I test verranno eseguiti e dovresti vedere l'output dei risultati dei test nel terminale.
