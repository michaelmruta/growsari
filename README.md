growsari demo spa web-app
--

Author: <michaelmruta@yahoo.com> (2019)

<https://cloud.docker.com/repository/docker/michaelmruta/growsari>

see screenshots folder
### A. REST API:

 ✔ Use proper HTTP headers and response codes, used 200, 400, 403 @done (19-09-17 04:20)<br />
 ✔ All ID’s are auto-generated and in UUID v1 format @done (19-09-17 04:20)<br />
 ✔ All timestamps are auto-generated and in ISO8601 format, used ISOString @done (19-09-17 04:20)<br />
 ✔ Token is in JWT format  @done (19-09-17 04:22)<br />
 ✔ Encrypt password -> used sha1 @done (19-09-17 04:20)<br />
 ✔ Include error checks -> used simple error handlers @done (19-09-17 04:20)<br />
 ✔ Users can only update and delete topics that they have created @done (19-09-17 04:20)<br />
 ✔ Topics are sorted alphabetically @done (19-09-17 04:20)<br />
 ✔ Messages are sorted in reverse chronological order @done (19-09-17 04:20)<br />

 ✔ 1a. Get User for GraphQL @done (19-09-17 04:20)<br />
 ☐ 1b. Retrieve a user for GraphQL (added)<br />
 ✔ 2. User Login @done (19-09-17 04:20)<br />
 ✔ 3. Create Topic @done (19-09-17 04:20)<br />
 ✔ 4. Update Topic @done (19-09-17 04:20)<br />
 ✔ 5. Delete Topic @done (19-09-17 04:20)<br />
 ✔ 6. Create Message in a Topic @done (19-09-17 04:20)<br />
 ✔ 7a. Retrieve all topics @done (19-09-17 04:20)<br />
 ☐ 7b. Retrieve a topic for GraphQL (added)<br />
 ✔ include not working @done (19-09-17 04:20)<br />
 ✔ 8. Retrieve all messages in a topic @done (19-09-17 04:20)<br />
 
 ✔ Add pagination to GET.​ ​-> use limit & offset in query string @done (19-09-17 04:23)<br />
 ✔ Soft Delete​ ​-> see paranoid @done (19-09-17 04:23)<br />
 ✔ Add a mechanism for single user -> revocation of older tokens using `issuedTokens` @done (19-09-17 04:24)<br />
 ✔ Unit tests -> using only node-fetch @done (19-09-17 04:27)<br />
 
### B. GRAPHQL:

 ✔ Wrapped to GraphQL @done (19-09-17 04:21)<br />
 ✔ Schema @done (19-09-17 04:28)<br />
 ✔ Mutations @done (19-09-17 06:11)<br />
 ✔ Query @done (19-09-17 04:28)<br />

### C. UI using REST:

 ✔ 1. User registration (​ 5 points) @done (19-09-18 04:31)<br />
 ✔ 2. User authentication (login and logout) ​(6 points) @done (19-09-18 04:31)<br />
 ✔ 3. Create topic (​ 5 points) @done (19-09-18 04:31)<br />
 ✔ 4. Update topic ​(5 points) @done (19-09-18 04:31)<br />
 ✔ 5. Delete topic ​(4 points) @done (19-09-18 04:31)<br />
 ✔ 6. List all topics (​ 5 points) @done (19-09-18 04:31)<br />
 ✔ 7. Add a message to a topic (​ 5 points) @done (19-09-18 04:31)<br />
 ✔ 8. List all messages in a topic ​(5 points) @done (19-09-18 04:31)<br />

 ✔ Error feedback -> basic responses using growl @done (19-09-18 04:32)<br />
 ✔ Page responsive @done (19-09-18 04:32)<br />
 ✔ Intuitive UI flow @done (19-09-18 04:32)<br />

Notes:
--
 - i moved JWT on Authorization header<br />
 - i used the GraphQL schema provided<br />
 - i added some api NOT in requirements<br />
 - vue was not implemented correctly on code, i just focused in the UI part since this is just ui.<br />
 - pwa, i dont know to do this stuff right, i attempted, theres a commented code somewhere<br />

Docker
---

#### Container 1 -> mysql (password used is root, db will be created automatically)
```
docker pull mysql
docker run --name=mysql -e MYSQL_ROOT_PASSWORD=root -d mysql 
```

#### Container 2 -> api-server
```
docker pull michaelmruta/growsari:api-server
docker run --name growsari-api -d --link mysql:db -p 80:80 michaelmruta/growsari:api-server
```

#### Container 3 -> ui-server
```
docker pull michaelmruta/growsari:ui-server
docker run -p 8080:8080 michaelmruta/growsari:ui-server
```

Tests
---

#### test rest api on http://localhost/
```
$ curl -d '{"name":"Michael", "email":"michaelmruta@yahoo.com", "password": "123456"}' \
	-H "Content-Type: application/json" -X POST http://localhost/user/register
```

#### test graphiql on http://localhost/graphql
```
mutation {
	user_register(name: "Michael", email: "michaelmruta@yahoo.com", password: "123456") {
		name
		email
		created_at

	}
}
```

#### web app on http://localhost:8080/

### These are the important files:

growsari-client/src/App.vue<br />
server/schema<br />
server/index.js<br />
server/test.js<br />
