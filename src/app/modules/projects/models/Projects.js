var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base');

var ProjectsCollection = Backbone.Collection.extend({
    model: Base.Model,
    url: '/data/projects/all.json'
});

module.exports = ProjectsCollection;
