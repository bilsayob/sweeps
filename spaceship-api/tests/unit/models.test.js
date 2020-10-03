var expect = require('chai').expect;
const spaceshipModel = require('../../models/event-spaceship');
const monitorModel = require('../../models/event-monitor');
const skyAnalyticsModel = require('../../models/event-sky-analytics');
const eventData = require('../data/event')

describe("Date Helper", function () {
    before(function (done) {
        done();
    });

    it('Can build model for Spaceship ', function (done) {
        const expected = {
            "t": "lift-off",
            "engines": 4,
            "fuel": 78,
            "successful": true,
            "temperature.engine": 80,
            "temperature.cabin": 31,
            "timestamp": 1595244264059,
            "lat-lon": "-16.270183,168.110748"
        }

        const model = spaceshipModel(eventData);
        expect(model).to.eql(expected);

        done();
    });

    it('Can build model for Monitor ', function (done) {
        const expected = {
            "t": "lift-off",
            "engines": 4,
            "fuel": 78,
            "successful": true,
            "temperature": {
                "engine": 80,
                "cabin": 31
            },
            "lat-lon": [
                -16.270183,
                168.110748
            ]
        }

        const model = monitorModel(eventData);
        expect(model).to.eql(expected);

        done();
    });

    it('Can build model for Sky Analytics ', function (done) {
        const expected = {
            "t": "lift-off",
            "Engines": 4,
            "Fuel": 78,
            "Successful": true,
            "Temperature": { "engine": 80, "cabin": 31 },
            "Timestamp": 1595244264059,
            "Lat-lon": "VHPM8.QYCK"
        }

        const internationalMapCode = "VHPM8.QYCK";
        const model = skyAnalyticsModel(eventData, internationalMapCode);
        expect(model).to.eql(expected);

        done();
    });
});