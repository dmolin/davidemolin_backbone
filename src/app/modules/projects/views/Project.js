var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    tpl = require('./templates');

var ProjectView = Base.View.extend({
    className: "pure-u-1 pure-u-sm-1-2 pure-u-md-1-3 pure-u-lg-1-4",
    tagName: "li",
    template: tpl.views.Project,
});

module.exports = ProjectView;