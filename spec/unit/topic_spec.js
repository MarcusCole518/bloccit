const sequelize = require("../../src/db/models/index").sequelize;
const Post = require("../../src/db/models").Post;
const Topic = require("../../src/db/models").Topic;
const User = require("../../src/db/models").User;

describe("Topic", () => {

    beforeEach((done) => {

        this.topic;
        this.post;
        this.user;

        sequelize.sync({force: true})
        .then((res) => {

            User.create({
                email: "starman@tesla.com",
                password: "Trekkie4lyfe"
            })
            .then((user) => {
                this.user = user;

                Topic.create({
                    title: "Great Beers I've Had This Week",
                    description: "A list of beers that I've enjoyed in the last 7 days",

                    posts: [{
                        title: "Double Dry Hopped Moral Support DIPA",
                        body: "I saw some rocks.",
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
                    this.post = topic.posts[0];
                    done();
                })
            });
        });
    });

    describe("#create()", () => {
        it("should create a title object with a title and description", (done) => {

            Topic.create({
                title: "Apple Products",
                description: "There's a lot of them."
            })
            .then((topic) => {
                expect(topic.title).toBe("Apple Products");
                expect(topic.description).toBe("There's a lot of them.");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a topic with missing title or description.", (done) => {
            Topic.create({
                title: "Apple Products"
            })
            .then((topic) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Topic.description cannot be null");
                done();
            })
        });
    });


    describe("#getPosts()", () => {
        it("should return the associated posts.", (done) => {
            Post.create({
                title: "Best Pizza Flavors",
                body: "Buffalo chicken",
                topicId: this.topic.id,
                userId: this.user.id
            })
            .then((topic) => {
                expect(this.topic.title).toBe("Great Beers I've Had This Week");
                expect(this.topic.description).toBe("A list of beers that I've enjoyed in the last 7 days");
                this.topic.getPosts()
                .then((associatedPosts) => {
                    expect(associatedPosts[0].title).toBe("Double Dry Hopped Moral Support DIPA");
                    expect(associatedPosts[1].title).toBe("Best Pizza Flavors");
                    done();
                })
            })
        });
    });
})