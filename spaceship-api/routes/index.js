var express = require('express');
var router = express.Router();
var MonitorService = require('../services/monitor')
var SpaceshipService = require('../services/spaceship')
var SkyAnalyticsService = require('../services/sky-analytics')

/* GET home page. */
router.post('/', function(req, res, next) {

  const eventsData = req.body;

  if (eventsData
      && eventsData.events
      && eventsData.events.length) {

    const publishPromises = [
      MonitorService.publishEvents,
      SpaceshipService.publishEvents,
      SkyAnalyticsService.publishEvents
    ].map(publishEvents => {
      return publishEvents(eventsData.events)
    });

    Promise.all(publishPromises)
      .then(responses => {
        res.json(responses)
      }).catch(err => {
        console.log(err);
        res.json([]);
      });
  } else {
    res.json([]);
  }
});

module.exports = router;
