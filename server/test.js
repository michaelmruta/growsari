/* 
 * This file can not be used, copied and/or distributed for commercial
 * purposes without the express permission of the author.
 *
 * Author: Michael Angelo Ruta <michaelmruta@yahoo.com>
 * Copyright (C) 2019. All Rights Reserved
 *
 * Unit Tests
 *
 */

const fetch = require('node-fetch');

(async () => {

    var topic = []

    console.log('\x1b[33m%s\x1b[0m', '1. User Registration')
    var req = "http://localhost/user/register"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                email: "meku@uchu-neko.com",
                name: "meku",
                password: "123456"
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '2. User Login')
    var req = "http://localhost/user/login"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                email: "meku@uchu-neko.com",
                password: "123456"
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            token = json.token
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '3. Create (30) Topics')
    var req = "http://localhost/topic"
    for (var i = 0; i < 10; i++) {
        console.log("req -> ",req)
        await fetch(req, {
                method: 'POST',
                body: JSON.stringify({
                    token: token,
                    subject: "Topic "+i,
                    description: "This is the description for Topic " +i
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then(res => res.json())
            .then(json => {
                topic[i] = json.id
                console.log("res -> ", json, "\n")
            });
    }

    console.log('\x1b[33m%s\x1b[0m', '4. Update Topic 1')
    var req = `http://localhost/topic/${topic[0]}`
    console.log("req -> ",req)
    await fetch(req, {
            method: 'PATCH',
            body: JSON.stringify({
                token: token,
                subject: "- Topic One",
                description: "This is the description for Topic One"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '5. Delete Topic 2')
    var req = `http://localhost/topic/${topic[1]}`
    console.log("req -> ",req)
    await fetch(req, {
            method: 'DELETE',
            body: JSON.stringify({
                token: token,
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '6. Seed Messagess on Topic 1')
    var req = `http://localhost/topic/${topic[0]}/message`
    for (var i = 0; i < 10; i++) {
        console.log("req -> ",req)
        await fetch(req, {
                method: 'POST',
                body: JSON.stringify({
                    token: token,
                    message: i+". - this is a message in topic 1"
                }),
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
            })
            .then(res => res.json())
            .then(json => {
                console.log("res -> ", json, "\n")
            });
    }

    var req = `http://localhost/topic/${topic[2]}/message`
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                message: "Hmm... Topic 3?"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '7. Retrieve all topics')
    var req = "http://localhost/topics"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'GET',
            // body: JSON.stringify({
            //     token: token,
            // }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', '8. Retrieve all messages in a topic')
    var req = `http://localhost/topic/${topic[0]}/messages`
    console.log("req -> ",req)
    await fetch(req, {
            method: 'GET',
            // body: JSON.stringify({
            //     token: token,
            // }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            previousResult = json
            console.log("res -> ", json, "\n")
        });


    await new Promise(resolve => setTimeout(resolve, 2000));

    console.log('\x1b[33m%s\x1b[0m', 'Misc. Pagination Test, Limit 1 & Offset 0')
    var req = "http://localhost/topics?limit=1&offset=0"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

    console.log('\x1b[33m%s\x1b[0m', 'Misc. Relogin & attemp to create a topic using old token')
    var req = "http://localhost/user/login"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                email: "meku@uchu-neko.com",
                password: "123456"
            }),
            headers: { 'Content-Type': 'application/json' },
        })
        .then(res => res.json())
        .then(json => {
            token_2 = json.token
            console.log("res -> ", json, "\n")
        });

    var req = "http://localhost/topic"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                subject: "Topic using old token",
                description: "This should NOT be inserted"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });
    var req = "http://localhost/topic"
    console.log("req -> ",req)
    await fetch(req, {
            method: 'POST',
            body: JSON.stringify({
                token: token,
                subject: "Topic using new token",
                description: "This should be inserted"
            }),
            headers: {
                'Content-Type': 'application/json',
                'Authorization': token_2
            },
        })
        .then(res => res.json())
        .then(json => {
            console.log("res -> ", json, "\n")
        });

})();