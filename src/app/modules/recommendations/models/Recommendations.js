var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base');


var RecommendationsCollection = Backbone.Collection.extend({
    model: Base.Model,
    url: '/data/recommendations/all.json'
});

module.exports = RecommendationsCollection;