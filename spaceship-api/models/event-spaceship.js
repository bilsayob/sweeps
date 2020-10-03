var flatten = require('flat');

function buildModel(data) {

    const latLon = data['lat-lon'];
    const latLonRemovedData = Object.assign({}, data);
    delete latLonRemovedData['lat-lon'];

    const result = flatten(latLonRemovedData);

    // Transform lat-lon
    if (latLon) {
        result['lat-lon'] = latLon.join(',');
    }

    return result;
}

module.exports = buildModel;