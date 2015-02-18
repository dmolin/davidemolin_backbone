var Backbone = global.Backbone,
    Base = require('backbone.base'),
    deps = require('../deps'),
    tpl = require('./templates');

var CarouselView = Base.View.extend({
    template: tpl.views.Carousel,
    className: "slides",

    events: {
    },

    afterRender: function() {
        if(this.collection && this.collection.length) {
            deps.common.helpers.ViewHelpers.initSlideshow(this.$el, {width: 960, height: 610});
        }
    },

    /*-----------------------------------
     * UI event handling
     *----------------------------------*/
});


module.exports = CarouselView;
