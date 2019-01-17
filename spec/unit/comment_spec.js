const sequelize = require("../../src/db/models/index").sequelize;
const Topic = require("../../src/db/models/topic").Topic;
const Post = require("../../src/db/models/post").Post;
const User = require("../../src/db/models/user").User;
const Comment = require("../../src/db/models/comment").Comment;

describe("Comment", () => {

    beforeEach((done) => {
        this.user;
        this.topic;
        this.post;
        this.comment;

        sequelize.sync({force: true})
        .then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Expeditions to Alpha Centauri",
                    description: "A compilation of reports from recent visits to the start system.",
                    posts: [{
                        title: "My first visit to Proxima Centauri b",
                        body: "I saw some rocks",
                        userId: this.user.id
                    }]
                }, {
                    include: {
                        model: Post,
                        as: "posts"
                    }
                })
                .then((topic) => {
                    this.topic = topic;
                    this.post = this.topic.posts[0];

                    Comment.create( {
                        body: "ay caramba!!!!!",
                        userId: this.user.id,
                        postId: this.post.id
                    })
                    .then((comment) => {
                        this.comment = comment;
                        done();
                    })
                    .catch((err) => {
                        console.log(err);
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });
    });

    describe("#create()", () => {

        it("should create a comment object with a body, assigned post and user", (done) => {

            Comment.create({
                body: "The geological kind.",
                postId: this.post.id,
                userId: this.user.id
            })
            .then((comment) => {
                expect(comment.body).toBe("The geological kind");
                expect(comment.postId).toBe(this.post.id);
                expect(comment.userId).toBe(this.user.id);
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a comment with a missing body, assigned post or user", (done) => {

            Comment.create({
                body: "Are the initial dampers still engaged?"
            })
            .then((comment) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Comment.userId cannot be null");
                expect(err.message).toContain("Comment.postId cannot be null");
                done();
            })
        });
    });

    describe("#setUser()", () => {
        it("should associate a comment and a user together", (done) => {

            User.create({
                email: "bob@example.com",
                password: "password"
            })
            .then((newUser) => {
                expect(this.comment.userId).toBe(this.user.id);
                this.comment.setUser(newUser)
                .then((comment) => {
                    expect(comment.userId)
                })
            })
        })
    })
})
