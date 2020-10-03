var expect = require('chai').expect;
const request = require('supertest');
const app = require('../../app');
const eventsData = require('../data/events')

function allItemsHaveStatus200(response) {
    return response.every(function (item) {
        return item.status === 200;
    });
}

describe("Route", function () {
    before(function (done) {
        done();
    });

    it('Can publish events', function (done) {
        request(app)
            .post('/')
            .send(eventsData)
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .then(async (res) => {
                expect(res.body).to.be.an('array');
                expect(res.body).to.have.lengthOf(3);
                expect(res.body[0].service).to.eql('monitor');
                expect(res.body[1].service).to.eql('spaceship');
                expect(res.body[2].service).to.eql('sky-analytics');
                expect(res.body[0].response).to.have.lengthOf(2);
                expect(res.body[1].response).to.have.lengthOf(2);
                expect(res.body[2].response).to.have.lengthOf(2);
                expect(res.body[0].response).to.satisfy(allItemsHaveStatus200);
                expect(res.body[1].response).to.satisfy(allItemsHaveStatus200);
                expect(res.body[2].response).to.satisfy(allItemsHaveStatus200);
                done();
            })
    });

    it('Can handle empty events', function (done) {

        const expected = [];

        request(app)
            .post('/')
            .send({})
            .set('Accept', 'application/json')
            .expect('Content-Type', /json/)
            .expect(200)
            .expect(expected)
            .end(function (err, res) {
                if (err) return done(err);
                done();
            });
    });
});
