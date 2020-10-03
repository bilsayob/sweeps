const eventSkyAnalyticsModel = require('../models/event-sky-analytics.js');
const api = require('../api');
const axios = require('axios');

exports.publishEvents = function (events) {
    const publishPromises = events.map(event => {
        const fetchLatLonUrl = `https://api.mapcode.com/mapcode/codes/${event['lat-lon'].join(',')}`;

        return axios.get(fetchLatLonUrl)
                .then(function (response) {
                    const internationalMapCode = response.data.international.mapcode;
                    const transformedEvent = eventSkyAnalyticsModel(event, internationalMapCode);
                    return api.post(`/skyanalytics/get`, transformedEvent)
                            .then(response => {
                                return Object.assign({ sent: transformedEvent }, response)
                            })
                }).catch(function (error) {
                    console.log(error);
                    reject(error)
                });
    });

    return Promise.all(publishPromises)
            .then((response) => {
                return {
                    service: "sky-analytics",
                    response: response
                }
            });
};