const sequelize = require("../../src/db/models/index").sequelize;
const Flair = require("../../src/db/models").Flair;
const Topic = require("../../src/db/models").Topic;

describe("Flair", () => {

    beforeEach((done) => {

        this.topic;
        this.flair;
        sequelize.sync({force: true})
        .then((res) => {

            Topic.create({
                title: "Productivity Boosters",
                description: "Use Flairs to tag topics!"
            })
            .then((topic) => {
                this.topic = topic;

                Flair.create({
                    name: "Important!",
                    color: "red",

                    topicId: this.topic.id
                    })
                    .then((flair) => {
                        this.flair = flair;
                        done();
                    });
                })
                .catch((err) => {
                    console.log(err);
                    done();
                });
            });
        });

    describe("#create()", () => {
        it("should create a flair signal with a name, color and assigned topic", (done) => {

            Flair.create({
                name: "Snooze",
                color: "orange",
                topicId: this.topic.id
            })
            .then((flair) => {
                expect(flair.name).toBe("Snooze");
                expect(flair.color).toBe("orange");
                done();
            })
            .catch((err) => {
                console.log(err);
                done();
            });
        });

        it("should not create a flair with missing name, color or assigned post.", (done) => {
            Flair.create({
                name: "Snooze"
            })
            .then((flair) => {
                done();
            })
            .catch((err) => {
                expect(err.message).toContain("Flair.color cannot be null");
                expect(err.message).toContain("Flair.topicId cannot be null");
                done();
            })
        });
    });

    describe("#setTopic()", () => {
        it("should associate a flair and a topic together", (done) => {

            Topic.create({
                title: "Things to do in the summer",
                description: "Have a BBQ!",
            })
            .then((newTopic) => {
                expect(this.flair.topicId).toBe(this.topic.id);
                this.flair.setTopic(newTopic)
                .then((flair) => {
                    expect(flair.topicId).toBe(newTopic.id);
                    done();
                });
            })
        });
    });

    describe("#getTopic()", () => {
        it("should return the associated flair", (done) => {
            this.flair.getTopic()
            .then((associatedTopic) => {
                expect(associatedTopic.title).toBe("Productivity Boosters");
                done();
            });
        });
    });
})