const capitalizeKey = (key) => {
    return key.charAt(0).toUpperCase() + key.slice(1)
}

function buildModel(data, internationalMapCode) {
    return Object.keys(data).reduce((result, key) => {

        const transformedKey = key !== 't' ? capitalizeKey(key) : key;

        if (key === 'lat-lon') {
            result[transformedKey] = internationalMapCode;
        } else {
            result[transformedKey] = data[key];
        }

        return result;
    }, {});
}

module.exports = buildModel;