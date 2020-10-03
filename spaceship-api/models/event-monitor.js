function buildModel(data) {
    return Object.keys(data).reduce((result, key) => {
        if (key !== 'timestamp') {
            result[key] = data[key];
        }

        return result;
    }, {});
}

module.exports = buildModel;