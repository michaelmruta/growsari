/* 
 * This file can not be used, copied and/or distributed for commercial
 * purposes without the express permission of the author.
 *
 * Author: Michael Angelo Ruta <michaelmruta@yahoo.com>
 * Copyright (C) 2019. All Rights Reserved
 *
 * Back End Server
 *
 */

// APP
const app = require('express')();
const bodyParser = require('body-parser')
const cors = require('cors')
const sha1 = require('sha1');
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
app.use(cors())
app.use(function(req,res,next) {
    if(req.query.limit) {
        req.query.limit = parseInt(req.query.limit)
    }
    if(req.query.offset) {
        req.query.offset = parseInt(req.query.limit)
    }
    next();
})

// JWT
const jwt = require('jsonwebtoken');
const jwt_secret = '12345'
let issuedTokens = {}

const authorize = (req, res, next) => {
    try {
        var user = jwt.verify(req.headers.authorization || req.body.token, jwt_secret);
        if (user.iat < issuedTokens[user.id]) {
            res.status(401).json({error:"session expired..."})
        } else {
            req.user = user.id
            next();
        }
    } catch(e) {
        res.status(403).json({error:"permission denied..."})
    }
}

// ORM
// Sequelize = require('sequelize');
// const sequelize = new Sequelize({
//     dialect: 'sqlite',
//     storage: 'database.sqlite',
//     logging: false
// });

const DB_NAME = 'db_growsari'
const DB_USER = 'root'
const DB_PASS = 'root'

Sequelize = require('sequelize')
const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: 'localhost',
  dialect: 'mysql',
  logging: false
});


const User = require('./models/user')(sequelize);
const Topic = require('./models/topic')(sequelize);
const Message = require('./models/message')(sequelize);

User.hasMany(Topic, { foreignKey: 'created_by' })
Topic.belongsTo(User, { foreignKey: 'created_by', targetKey: "id"})
Topic.belongsTo(User, { foreignKey: 'updated_by', targetKey: "id" })
Topic.hasMany(Message, { onDelete: 'cascade', foreignKey: 'topic_id', onDelete: 'cascade' })
Message.belongsTo(User, { foreignKey: 'created_by', targetKey: "id" })
Message.belongsTo(User, { foreignKey: 'updated_by', targetKey: "id" })

const hideIsDeleted = function() {
    let values = Object.assign({}, this.get());
    delete values.deletedAt;
    return values;
}
Topic.prototype.toJSON = hideIsDeleted
Message.prototype.toJSON = hideIsDeleted

const mysql = require('mysql2/promise');
mysql.createConnection({
    user     : DB_USER,
    password : DB_PASS
}).then( connection => {
    connection.query('CREATE DATABASE IF NOT EXISTS db_growsari;').then(() => {
        sequelize.sync({ force: true });
    })
})

// ROUTES

app.get('/', (req, res) => {
    res.end("")
})

// 1a. Get User for GraphQL
app.post('/user/register', (req, res) => {
    req.body.password = sha1(req.body.password)
    User.create(req.body).then(user => {
        user = user.get({
            plain: true
        });
        delete user.password
        res.json(user)
    }).catch(e => {
        res.status(400).json(e)
    })
})

// 1b. Retrieve a user for GraphQL
app.get('/user/:id', (req, res) => {
    User.findByPk(req.params.id).then(user => {
        user = user.get({
            plain: true
        });
        delete user.password
        res.json(user || {})
    }).catch(e => {
        res.status(400).json(e)
    })
})

// 2. User Login
app.post('/user/login', (req, res) => {
    User.findOne({
            where: {
                email: req.body.email,
                password: sha1(req.body.password)
            }
        })
        .then(result => {
            if(!result) {
                res.status(400).json({error:"invalid username/password..."})
                return
            }
            let token = jwt.sign({ id: result.id }, jwt_secret);

            let issued = jwt.verify(token, jwt_secret)
            issuedTokens[issued.id] = issued.iat

            res.json({ token: token })
        }).catch(e => {
            res.status(400).json(e)
        })
})

// 3. Create Topic
app.post('/topic', authorize, (req, res) => {
    User.findByPk(req.user)
        .then(result => {
            let topic = req.body

            topic.created_by = req.user
            topic.updated_by = req.user

            return Topic.create(topic, { plain: true })
                .then(topic => {
                    res.json(topic)
                }).catch(e => {
                    res.status(400).json({error:e.toString()})
                })
        }).catch(e => {
            res.status(400).json({error:e.toString()})
        })
})

// 4. Update Topic
app.patch('/topic/:id', authorize, (req, res) => {
    let topic_id = req.params.id

    let topic = req.body;
    topic.updated_by = req.user

    Topic.update(topic, {
            where: {
                id: topic_id,
                created_by: req.user
            }
        })
        .then(result => {

            return Topic.findByPk(topic_id)
                .then(topic => {
                    res.json(topic)
                }).catch(e => {
                    res.status(400).json({error:e.toString()})
                })

        })
        .catch(e => {
            res.status(400).json({error:e.toString()})
        })
})

// 5. Delete Topic
app.delete('/topic/:id', authorize, (req, res) => {
    let topic_id = req.params.id

    Topic.destroy({
            where: {
                id: topic_id,
                created_by: req.user
            }
        })
        .then(result => {
            res.json({ success: result})
        })
        .catch(e => {
            res.status(400).json({error:e.toString()})
        })
})

// 6. Create Message in a Topic
app.post('/topic/:id/message', authorize, (req, res) => {
    let topic_id = req.params.id

    Topic.findOne({
            where: {
                id: topic_id,
                created_by: req.user
            }
        })
        .then(topic => {

            var m = new Message()
            m.topic_id = topic_id
            m.message = req.body.message
            m.updated_by = req.user
            m.created_by = req.user
            topic.addMessage(m)

            return m.save()
                .then(message => {
                    res.json(m)
                }).catch(e => {
                    res.status(400).json({error:e.toString()})
                })
        }).catch(e => {
            res.status(400).json({error:e.toString()})
        })
})

// 7a. Retrieve all topics
app.get('/topics', authorize, (req, res) => {

    Topic.findAll({ order: [['subject', 'ASC']], ...req.query })
        .then(topics => {
            res.json({ data: topics || [] })
        }).catch(e => {
            res.status(400).json(e)
        })
})

// 7b. Retrieve a topic for GraphQL
app.get('/topic/:id', authorize, (req, res) => {

    let topic_id = req.params.id

    // include not working
    Topic.findByPk(topic_id)
        .then(topic => {
        return Message.findAll({
                where: { topic_id: topic_id },
                order: [
                    ['created_at', 'DESC']
                ],
                ...req.query
            })
            .then(messages => {
                topic = topic.get({
                    plain: true
                });
                topic.messages = messages
                res.json(topic)
            }).catch(e => {
                res.status(400).json(e)
            })
        }).catch(e => {
            res.status(400).json(e)
        })
})

// 8. Retrieve all messages in a topic
app.get('/topic/:id/messages', authorize, (req, res) => {

    let topic_id = req.params.id
    Message.findAll({
            where: { topic_id: topic_id },
            order: [
                ['created_at', 'DESC']
            ],
            ...req.query
        })
        .then(messages => {
            res.json({ data: messages || [] })
        }).catch(e => {
            res.status(400).json(e)
        })
});

// GraphQL
const graphqlHTTP = require('express-graphql')
const schema = require('./schema/schema')
app.use('/graphql', graphqlHTTP({
    schema, 
    graphiql: true
}));

app.listen(80, () => {
    console.log('\x1b[36m%s\x1b[0m', "Server running on port 80");
    console.log('\x1b[36m%s\x1b[0m', "GraphiQL is on http://localhost/graphql\n");
    console.log('\x1b[36m%s\x1b[0m', "Running Tests....");
    setTimeout(() => require('./test'), 1000)
})