// server.test.js
const { test } = require('tap');
const fastify = require('./server');

let token,tokenAdmin;

//TEST USER ROUTES
test('Test Register endpoint', async (t) => {
    // Register
    let response = await fastify.inject({
        method: 'POST',
        url: '/register',
        payload:{
            email:"prova@example.com",
            password:"password"
        },
    });
    t.equal(response.statusCode, 201);

    // Invalid email
    response = await fastify.inject({
        method: 'POST',
        url: '/register',
        payload:{
            email:"ppp",
            password:"password"
        },
    });
    t.equal(response.statusCode, 400);

    // User già esistente
    response = await fastify.inject({
        method: 'POST',
        url: '/register',
        payload:{
            email:"prova@example.com",
            password:"password"
        },
    });
    t.equal(response.statusCode, 400);

});

test('Test Login endpoint', async (t) => {
    //Email non esistente
    let response = await fastify.inject({
        method: 'POST',
        url: '/login',
        payload: {
            email:"nonexisting@example.com",
            password:"password"
        },
    });
    t.equal(response.statusCode,404);

    //Password sbagliata
    response = await fastify.inject({
        method: 'POST',
        url: '/login',
        payload: {
            email:"prova@example.com",
            password:"passworderrata"
        },
    });
    t.equal(response.statusCode,400);

    //Login corretto
    response = await fastify.inject({
        method: 'POST',
        url: '/login',
        payload: {
            email:"prova@example.com",
            password:"password"
        },
    });
    t.equal(response.statusCode, 200);
    token = response.cookies.pop().value;

});


//TEST DATA ROUTES
test('Test Post Data endpoint', async (t) => {
    // Non loggato
    let response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{},
        payload:{
            key:"key",
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 401);


    // Create Data
    response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            key:"key",
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 201);

    // Key già presente
    response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            key:"key",
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 400);

    // Non base64
    response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            key:"key1",
            data:">"
        },
    });
    t.equal(response.statusCode, 400);
});

test('Test Get Data endpoint', async (t) => {
    // Non loggato
    let response = await fastify.inject({
        method: 'GET',
        url: '/data/key',
        headers:{}
    });
    t.equal(response.statusCode, 401);

    // Get Data
    response = await fastify.inject({
        method: 'GET',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 200);

    // Key non esistente
    response = await fastify.inject({
        method: 'GET',
        url: '/data/keynonesistente',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 404);

    // Non base64
    response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            key:"key1",
            data:">"
        },
    });
    t.equal(response.statusCode, 400);
});

test('Test Patch Data endpoint', async (t) => {
    // Non loggato
    let response = await fastify.inject({
        method: 'PATCH',
        url: '/data/key',
        headers:{},
        payload:{
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 401);


    // Patch Data
    response = await fastify.inject({
        method: 'PATCH',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 200);

    // Key non presente
    response = await fastify.inject({
        method: 'PATCH',
        url: '/data/keynonesistente',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            data:"cGlwcG8="
        },
    });
    t.equal(response.statusCode, 404);

    // Non base64
    response = await fastify.inject({
        method: 'PATCH',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            data:">"
        },
    });
    t.equal(response.statusCode, 400);
});

test('Test Delete Data endpoint', async (t) => {
    // Non loggato
    let response = await fastify.inject({
        method: 'DELETE',
        url: '/data/key',
        headers:{}
    });
    t.equal(response.statusCode, 401);

    // Delete Data
    response = await fastify.inject({
        method: 'DELETE',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 200);

    // Key non esistente
    response = await fastify.inject({
        method: 'DELETE',
        url: '/data/keynonesistente',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 404);

});

//TEST ADMIN
test('Test Admin Login endpoint', async (t) => {
    //Login admin
    let response = await fastify.inject({
        method: 'POST',
        url: '/login',
        payload: {
            email:"admin",
            password:"password"
        },
    });
    t.equal(response.statusCode, 200);
    tokenAdmin = response.cookies.pop().value;
});
test('Test Admin Create Data endpoint', async (t) => {
    // Create Data
    let response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${tokenAdmin}`
        },
        payload:{
            email:"prova@example.com",
            key:"key",
            data:"dati"
        },
    });
    t.equal(response.statusCode, 201);

    //Non Admin
    response = await fastify.inject({
        method: 'POST',
        url: '/data',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            email:"admin",
            key:"key",
            data:"pruzzg=="
        },
    });
    t.equal(response.statusCode, 403);
});

test('Test Admin Get Data endpoint', async (t) => {
    // Get Data
    let response = await fastify.inject({
        method: 'GET',
        url: '/data/key?email=prova@example.com',
        headers:{
            Authorization: `Bearer ${tokenAdmin}`
        }
    });
    t.equal(response.statusCode, 200);

    // Non Admin
    response = await fastify.inject({
        method: 'GET',
        url: '/data/key?email=admin',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 403);
});

test('Test Admin Patch Data endpoint', async (t) => {
    // Create Data
    let response = await fastify.inject({
        method: 'PATCH',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${tokenAdmin}`
        },
        payload:{
            email:"prova@example.com",
            data:"dati"
        }
    });
    t.equal(response.statusCode, 200);

    //Non Admin
    response = await fastify.inject({
        method: 'PATCH',
        url: '/data/key',
        headers:{
            Authorization: `Bearer ${token}`
        },
        payload:{
            email:"admin",
            data:"datilok="
        },
    });
    t.equal(response.statusCode, 403);
});
test('Test Admin Delete Data endpoint', async (t) => {
    // Delete Data
    let response = await fastify.inject({
        method: 'DELETE',
        url: '/data/key?email=prova@example.com',
        headers:{
            Authorization: `Bearer ${tokenAdmin}`
        }
    });
    t.equal(response.statusCode, 200);

    // Non Admin
    response = await fastify.inject({
        method: 'DELETE',
        url: '/data/key?email=admin',
        headers:{
            Authorization: `Bearer ${token}`
        }
    });
    t.equal(response.statusCode, 403);
});

test('Test Delete endpoint', async (t) => {
    let response = await fastify.inject({
        method: 'DELETE',
        url: '/delete',
        headers:{
            Authorization:`Bearer ${token}`
        }
    });
    t.equal(response.statusCode,204);
    await fastify.close();
    t.end();
});







