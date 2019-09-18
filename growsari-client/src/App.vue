<template>
    <div id="app">
        <div class="container" v-if="!token">
            <div class="container" v-if="page == 'login'">
                <div class="row">
                    <div class="col-4 offset-4">
                        <h1>Login User</h1>
                        <div class="form-group">
                            <label for="email">Email address:</label>
                            <input type="email" class="form-control" id="email" v-model="user.email" autofocus>
                        </div>
                        <div class="form-group">
                            <label for="pwd">Password:</label>
                            <input type="password" class="form-control" id="pwd" v-model="user.password">
                        </div>
                        <div class="form-group">
                            <button type="button" class="btn btn-primary" @click="userLogin()">
                                <i class="fa fa-check"></i> Login</button>
                            <button type="button" class="btn btn-outline-secondary" @click="changePage('register')">
                                <i class="fa fa-user"></i> Register</button>
                        </div>
                        <i class='text-danger'>sample user account on first load...</i>
                    </div>
                </div>
            </div>
            <div class="container" v-if="page == 'register'">
                <div class="row">
                    <div class="col-4 offset-4">
                        <form @submit="registerUser($event)">
                            <h1>Register User</h1>
                            <div class="form-group">
                                <label for="name">Name:</label>
                                <input type="text" class="form-control" id="name" v-model="user.name" autofocus required minlength="4">
                            </div>
                            <div class="form-group">
                                <label for="email">Email address:</label>
                                <input type="email" class="form-control" id="email" v-model="user.email" required>
                            </div>
                            <div class="form-group">
                                <label for="pwd">Password:</label>
                                <input type="password" class="form-control" id="pwd" v-model="user.password" required required minlength="8">
                            </div>
                            <div class="form-group">
                                <label for="cpwd">Confirm Password:</label>
                                <input type="password" class="form-control" id="cpwd" v-model="user.cpassword" required required minlength="8">
                            </div>
                            <div class="form-group">
                                <button type="submit" class="btn btn-primary">
                                    <i class="fa fa-check"></i> Submit</button>
                                <button type="button" class="btn btn-danger" @click="changePage('login')">
                                    <i class="fa fa-close"></i> Cancel</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        <div class="container" v-if="token">
            <div v-if="page == 'topics'">
                <div class="row">
                    <div class="col-10 offset-1">
                        <h1>List Topics</h1>
                        <table class="table">
                            <th>Subject</th>
                            <th>Author</th>
                            <th>Date</th>
                            <th>Action</th>
                            <tr v-for="t in topics">
                                <td>{{t.subject}}</td>
                                <td>{{ t.created_by }}</td>
                                <td>{{t.created_at}}</td>
                                <td>
                                    <button class="btn btn-sm btn-primary" @click="getTopic(t.id, 'view')">
                                        <i class="fa fa-eye"></i> View</button>
                                    <button class="btn btn-sm btn-warning" @click="getTopic(t.id, 'edit')">
                                        <i class="fa fa-pencil"></i> Edit</button>
                                    <button class="btn btn-sm btn-danger" @click="deleteTopic(t.id)">
                                        <i class="fa fa-trash"></i> Delete</button>
                                </td>
                            </tr>
                            <tr class="no_more text-center">
                                <td colspan="4"><i> -- no more data -- </i></td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-10 offset-1">
                        <button type="button" class="btn btn-outline-secondary float-left" @click="logout()">
                            <i class="fa fa-arrow-left"></i> Logout</button>
                        <button type="button" class="btn btn-primary float-right" @click="topic = {}; changePage('add_topic')">
                            <i class="fa fa-plus"></i> Add Topic</button>
                    </div>
                </div>
            </div>
            <div class="container" v-if="page == 'view_topic'">
                <div class="row">
                    <div class="col-10 offset-1">
                        <h1>View Topic</h1>
                        <p class='d-block text-left'><strong>Subject: </strong> {{topic.subject}}</p>
                        <p class='d-block text-left'><strong>Descripion: </strong> {{topic.description}}</p>
                        <p class='d-block text-left'><strong>Author: </strong> {{ topic.created_by }}</p>
                        <p class='d-block text-left'><strong>Created: </strong> {{topic.created_at}}</p>
                    </div>
                    <div class="col-10 offset-1">
                        <h3>Messages</h3>
                        <table class="table">
                            <th>Messages</th>
                            <th>Author</th>
                            <th>Date</th>
                            <tr v-for="m in topic.messages">
                                <td>{{m.message}}</td>
                                <td>{{m.created_by}}</td>
                                <td>{{m.created_at}}</td>
                            </tr>
                            <tr v-if="topic.messages.length == 0">
                                <td colspan="4"><i>no data...</i></td>
                            </tr>
                            <tr class="no_more text-center">
                                <td colspan="4"><i> -- no more data -- </i></td>
                            </tr>
                        </table>
                    </div>
                    <div class="col-10 offset-1">
                        <button type="button" class="btn btn-outline-secondary float-left" @click="changePage('topics')">
                            <i class="fa fa-arrow-left"></i> Return to Topics List</button>
                    </div>
                </div>
            </div>
            <div v-if="page == 'add_topic'">
                <div class="row">
                    <div class="col-10 offset-1">
                        <h1>Add Topic</h1>
                        <form @submit="registerUser($event)">
                            <div class="form-group text-left">
                                <label for="subject">Subject</label>
                                <input class="form-control" name="subject" id="subject" rows="4" v-model="topic.subject"></textarea>
                            </div>
                            <div class="form-group text-left">
                                <label for="description text-left">Description</label>
                                <textarea class="form-control" name="description" id="description" rows="4" v-model="topic.description"></textarea>
                            </div>
                            <button type="button" class="btn btn-outline-secondary float-left" @click="changePage('topics')">
                                <i class="fa fa-arrow-left"></i> Return to Topics List</button>
                            <button type="button" class="btn btn-primary float-right" @click="createTopic()">
                                <i class="fa fa-save"></i> Save</button>
                        </form>
                    </div>
                </div>
            </div>
            <div class="container" v-if="page == 'edit_topic'">
                <div class="row">
                    <div class="col-10 offset-1">
                        <h1>Edit Topic</h1>
                        <div class="form-group text-left">
                            <label for="subject">Subject</label>
                            <input class="form-control" name="subject" id="subject" rows="4" v-model="topic.subject">
                        </div>
                        <div class="form-group text-left">
                            <label for="description text-left">Description</label>
                            <textarea class="form-control" name="description" id="description" rows="4" v-model="topic.description">
                            </textarea>
                        </div>
                        <div class="form-group">
                            <h3>Messages</h3>
                            <table class="table">
                                <th>Messages</th>
                                <th>Author</th>
                                <th>Date</th>
                                <tr v-for="m in topic.messages">
                                    <td>{{m.message}}</td>
                                    <td>{{m.created_by}}</td>
                                    <td>{{m.created_at}}</td>
                                </tr>
                                <tr v-if="topic.messages.length == 0">
                                    <td colspan="4"><i>no data...</i></td>
                                </tr>
                                <tr class="no_more text-center">
                                    <td colspan="4"><i> -- no more data -- </i></td>
                                </tr>
                            </table>
                        </div>
                        <form @submit="registerUser($event)">
                            <div class="form-group text-left">
                                <button type="button" class="btn btn-outline-secondary float-left" @click="changePage('topics')">
                                    <i class="fa fa-arrow-left"></i> Return to Topics List</button>
                                <button type="button" class="btn btn-primary float-right" @click="editTopic()">
                                    <i class="fa fa-save"></i> Save</button>
                                <button type="button" class="btn btn-outline-secondary float-right" @click="changePage('add_message')">
                                    <i class="fa fa-plus"></i> Add Message</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
            <div class="container" v-if="page == 'add_message'">
                <div class="row">
                    <div class="col-10 offset-1">
                        <h1>Add Message</h1>
                        <div class="form-group text-left">
                            <label for="message text-left">Message</label>
                            <textarea class="form-control" name="message" id="message" rows="4" v-model="message">
                            </textarea>
                        </div>
                        <div class="form-group text-left">
                            <button type="button" class="btn btn-outline-secondary float-left" @click="changePage('edit_topic')">
                                <i class="fa fa-arrow-left"></i> Return to Topic</button>
                            <button type="button" class="btn btn-primary float-right" @click="addMessage()">
                                <i class="fa fa-save"></i> Save</button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        <footer>&copy; 2019 Meku </footer>
    </div>
</template>
<script>
const baseURL = 'http://localhost'

export default {
    name: 'app',
    data() {
        return {
            token: null,
            page: 'login',
            usersCache: {},
            topicsCache: [],
            messagesCache: [],
            user: { email: "meku@uchu-neko.com", password: "123456" },
            topics: [],
            topic: {},
            message: "",
            per_load: 10,
            locked: false,
            connected: true
        }
    },
    methods: {
        async userLogin() {
            let self = this
            try {
                const res = await $.post(baseURL + "/user/login", {
                    email: self.user.email,
                    password: self.user.password
                })
                if (res.token) {
                    $.bootstrapGrowl('Welcome!', { type: 'success' });
                    self.page = 'topics'
                    self.token = res.token

                    $.ajaxSetup({
                        headers: {
                            'Authorization': self.token
                        }
                    });
                    self.changePage('topics')
                } else {
                    $.bootstrapGrowl('invalid user/pass', { type: 'danger' });
                    self.user = {}
                    $("#email").focus()
                }
                this.$session.start();
                this.$session.set('jwt', res.token)
            } catch (e) {
                $.bootstrapGrowl(e.responseJSON.error, { type: 'danger' });
            }
        },
        async registerUser(e) {
            e.preventDefault();
            let self = this
            try {
                if (self.user.password != self.user.cpassword) {
                    throw ''
                }
                var user = self.user;
                const res = await $.post(baseURL + "/user/register", user)
                if (res.id) {
                    $.bootstrapGrowl("Succesfully created " + res.email, { type: 'success' });
                    self.page = "login"
                } else {
                    $.bootstrapGrowl("Error", { type: 'danger' });
                }
            } catch (e) {
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async getUserFor(id) {
            var self = this
            if (!self.usersCache[id]) {
                self.usersCache[id] = await $.get(baseURL + "/user/" + id)
            }
            return self.usersCache[id].name
        },
        async getTopics() {
            let self = this
            try {
                $.ajaxSetup({
                    headers: {
                        'Authorization': self.token
                    }
                });

                const res = await $.get(baseURL + "/topics", { offset: self.topics.length, limit: self.per_load })
                self.locked = false
                for (var topic of res.data) {
                    topic.created_by = await self.getUserFor(topic.created_by)
                }

                self.topics = self.topics.concat(res.data)
                if (!res.data.length) {
                    $('.no_more').show();
                }
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async getTopic(id, action) {
            let self = this
            try {
                self.topic = await $.get(baseURL + "/topic/" + id, { offset: 0, limit: self.per_load })
                self.topic.created_by = await self.getUserFor(self.topic.created_by)
                for (var message of self.topic.messages) {
                    message.created_by = await self.getUserFor(message.created_by)
                }
                self.page = action + '_topic'
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async getMessage() {
            let self = this
            try {
                var offset = (self.topic.messages) ? self.topic.messages.length : 0
                var res = await $.get(baseURL + "/topic/" + self.topic.id + "/messages", { offset: self.topic.messages.length, limit: self.per_load })
                self.locked = false
                for (var message of res.data) {
                    message.created_by = await self.getUserFor(message.created_by)
                    self.topic.messages.push(message)
                }
                if (!res.data.length) {
                    $('.no_more').show();
                }
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async createTopic(cachedWrite) {
            let self = this
            try {
                self.topic = await $.post(baseURL + "/topic", {
                    subject: self.topic.subject,
                    description: self.topic.description
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.readyState == 0 && !cachedWrite) {
                        self.topicsCache.push(Object.assign(self.topic))
                        self.changePage('topics')
                        self.connected = false
                        $.bootstrapGrowl("You are not connected...", { type: 'danger' });
                    }
                })
                
                if(!cachedWrite) {
                    self.changePage('topics')
                }
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async editTopic() {
            let self = this
            try {
                var topic = self.topic
                const res = await $.ajax({
                    url: baseURL + "/topic/" + topic.id,
                    type: 'PATCH',
                    data: {
                        subject: topic.subject,
                        description: topic.description,
                    }
                })
                self.changePage('topics')
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async deleteTopic(id) {
            let self = this
            try {
                var sure = confirm("Are you sure?")
                if (sure) {
                    const res = await $.ajax({ url: baseURL + "/topic/" + id, type: 'DELETE' })
                    self.changePage('topics')
                }
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        async addMessage(cachedWrite) {
            let self = this
            try {
                var message = await $.post(baseURL + "/topic/" + self.topic.id + "/message", {
                    message: self.message
                }).fail(function(jqXHR, textStatus, errorThrown) {
                    if (jqXHR.readyState == 0 && !cachedWrite) {
                        self.messagesCache.push(Object.assign({topid_id:self.topic.id,message:self.message}))
                        self.changePage('edit_topic')
                        self.message = ""
                        self.connected = false
                        $.bootstrapGrowl("You are not connected...", { type: 'danger' });
                    }
                })

                if(!cachedWrite) {
                    self.getTopic(self.topic.id, 'edit', 0, self.per_load)
                    self.message = ""
                }
            } catch (e) {
                console.log(e)
                $.bootstrapGrowl(e.responseJSON.parent.code, { type: 'danger' });
            }
        },
        logout: function() {
            this.$session.destroy()
            this.token = null
            this.page = "login"
        },
        changePage(page) {
            this.user = {}
            this.page = page
            if (page == 'topics') {
                this.topics = []
                this.getTopics();
            }
        },

    },
    mounted: function() {
        var self = this
        if (self.$session.exists()) {
            self.token = self.$session.get('jwt')
            if (self.token) {
                self.changePage('topics');
                $.ajaxSetup({
                    headers: {
                        'Authorization': self.token
                    }
                });
            }
        }
        $(window).scroll(function() {
            if ($(window).scrollTop() + $(window).height() >= $("#app").height() + 50) {
                if (!self.locked) {
                    if (self.page == 'topics') {
                        self.locked = true;
                        self.getTopics()
                    }
                    if (self.page == 'view_topic' || self.page == 'edit_topic') {
                        self.locked = true;
                        self.getMessage()
                    }
                }
            }
        });

        // PWA SERVICE WORKER????
        // setInterval(function() {
        //     if(!self.connected) {
        //         if(self.topicsCache) {
        //             for (var t of self.topicsCache) {
        //                 self.topic = t
        //                 self.createTopic(1)
        //             }
        //             self.topic = {}
        //         }
        //         if(self.messagesCache) {
        //             for (var m of self.messageCache) {
        //                 self.topic.id = m.topic_id
        //                 self.message = m.message
        //                 self.createTopic(1)
        //             }
        //             self.message = {}
        //         }
        //     }
        // }, 2000)
    }
}
</script>
<style>
#app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-align: center;
    color: #2c3e50;
    margin-top: 60px;
}

button {
    margin: 0 2px;
}

h2,
h3,
table {
    text-align: left;
}

td:last-child {
    width: 300px;
}

footer {
    display: block;
    padding: 20px;
    width: 100%;
    bottom: 10px;
}

a[disabled] {
    color: #ccc;
}

.no_more {
    display: none;
}
</style>