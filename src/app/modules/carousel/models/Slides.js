var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base');

var SlidesCollection = Backbone.Collection.extend({
    model: Base.Model,
    url: '/data/carousel/all.json'
});

module.exports = SlidesCollection;
