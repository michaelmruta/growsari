/* 
 * This file can not be used, copied and/or distributed for commercial
 * purposes without the express permission of the author.
 *
 * Author: Michael Angelo Ruta <michaelmruta@yahoo.com>
 * Copyright (C) 2019. All Rights Reserved
 *
 * GraphQL/REST Wrapper
 *
 */

const { buildSchema, GraphQLSchema } = require('graphql')
const { readFileSync } = require('fs')
const fetch = require('node-fetch')
const Schema = buildSchema(readFileSync('./schema/schema.graphql').toString())
const baseURL = 'http://localhost'

const httpReq = (path, method, args) => {
    return fetch(baseURL+path, {
        method: method,
        body: method != 'GET' ? JSON.stringify(args) : null, // Request with GET/HEAD method cannot have body
        headers: {
            'Content-Type': 'application/json',
            'Authorization': args.token
        }
    }).then(res => res.json())
}

// queries resolver
const QueryType = Schema._typeMap.Query
let q = QueryType._fields

q.topic.resolve = async (parent, args) => {
    let topic = await httpReq(`/topic/${args.id}`, 'GET', args)
    topic.created_by = await httpReq(`/user/${topic.created_by}`, 'GET', args)
    topic.updated_by = await httpReq(`/user/${topic.updated_by}`, 'GET', args)
    for(message of topic.messages) {
        message.created_by = await httpReq(`/user/${message.created_by}`, 'GET', args)
        message.updated_by = await httpReq(`/user/${message.updated_by}`, 'GET', args)        
    }
    return topic
}
q.topics.resolve = async (parent, args) => {
    let topics = await httpReq(`/topics`, 'GET', args)
    for(topic of topics.data) {
        topic.created_by = await httpReq(`/user/${topic.created_by}`, 'GET', args)
        topic.updated_by = await httpReq(`/user/${topic.updated_by}`, 'GET', args)
    }
    return topics.data 
}

// mutations resolver
const MutationType = Schema._typeMap.Mutation
let m = MutationType._fields

m.user_register.resolve = async (parent, args) => 
    await httpReq(`/user/register`, 'POST', args)
m.user_login.resolve = async (parent, args) => 
    (await httpReq(`/user/login`, 'POST', args)).token
m.topic_create.resolve = async (parent, args) => 
    await httpReq(`/topic`, 'POST', args)
m.topic_update.resolve = async (parent, args) => 
    await httpReq(`/topic/${args.id}`, 'PATCH', args)
m.topic_delete.resolve = async (parent, args) => 
    (await httpReq(`/topic/${args.id}`, 'DELETE', args)).success
m.message_create.resolve = async (parent, args) => 
    await httpReq(`/topic/${args.topic_id}/message`, 'POST', args)

module.exports = new GraphQLSchema({
    query: QueryType,
    mutation: MutationType
})