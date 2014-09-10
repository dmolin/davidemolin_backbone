var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    deps = require('../deps'),
    tpl = require('./templates');

//

var RecommendationsView = Base.View.extend({
    tagName: "div",
    className: "slides",
    template: tpl.views.Recommendations,


    afterRender: function() {
        if(!this.attached) return;

        var ViewHelpers = deps.common.helpers.ViewHelpers;

        //init slideshow
        if(this.$('.slide').length) {
            ViewHelpers.initSlideshow( this.$el, {width: 300, height: 270 });
        }
    }

});

module.exports = RecommendationsView;
