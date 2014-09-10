var HomeModule = {
    views: require('./views'),
    deps: {
        common: require('../common'),
        carousel: require('../carousel'),
        projects: require('../projects'),
        recommendations: require('../recommendations')
    }
};

module.exports = HomeModule;
