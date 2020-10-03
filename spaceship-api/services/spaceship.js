const eventSpaceshipModel = require('../models/event-spaceship.js');
const api = require('../api');

exports.publishEvents = function (events) {
    const publishPromises = events.map(event => {
        const transformedEvent = eventSpaceshipModel(event);
        return api.post(`/spaceship/r`, transformedEvent)
                .then(response => {
                    return Object.assign({ sent: transformedEvent }, response)
                })
    });

    return Promise.all(publishPromises)
        .then((response) => {
            return {
                service: "spaceship",
                response: response
            }
        });
};