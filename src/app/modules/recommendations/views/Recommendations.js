var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    tpl = require('./templates');

//

var RecommendationsView = Base.View.extend({
    tagName: "div",
    className: "slides",
    template: tpl.views.Recommendations,

    constructor: function() {
        Base.View.prototype.constructor.apply(this, arguments);
        this._module = require("../");
    },    

    initialize: function() {
        var self = this;
        Base.View.prototype.initialize.apply(this, arguments);
    },

    afterRender: function() {
        if(!this.attached) return;

        //TODO: need to be fixed: I cannot require these too early, otherwise the module itself is not properly filled in...
        var ViewHelpers = this._module.deps.common.helpers.ViewHelpers;

        //init slideshow
        if(this.$('.slide').length) {
            ViewHelpers.initSlideshow( this.$el, {width: 300, height: 270 });
        }
    }

});

module.exports = RecommendationsView;
