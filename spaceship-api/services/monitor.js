const eventMonitorModel = require('../models/event-monitor.js');
const api = require('../api');

exports.publishEvents = function (events) {
    const publishPromises = events.map(event => {
        const transformedEvent = eventMonitorModel(event);
        return api.put(`/m0nit0r.com/track_ship/${event.timestamp}`, transformedEvent)
                .then(response => {
                    return Object.assign({ sent: transformedEvent }, response)
                })
    });

    return Promise.all(publishPromises)
            .then((response) => {
                return {
                    service: "monitor",
                    response: response
                }
            });
};