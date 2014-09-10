var Backbone = global.Backbone,
    Base = require('backbone.base'),
    tpl = require('./templates');

var CarouselView = Base.View.extend({
    template: tpl.views.Carousel,
    className: "slides",

    events: {
        'click .slide': 'onSlideSelection'
    },

    constructor: function() {
        Base.View.prototype.constructor.apply(this, arguments);
        this._module = require("../");
    },

    afterAttach: function() {
        //init slideshow
        initSlideshow(this.$el, {width: 960, height: 610});

        console.log("module = ", this._module);
    },

    /*-----------------------------------
     * UI event handling
     *----------------------------------*/
    onSlideSelection: function(evt) {
        if(evt) evt.preventDefault();
        var url = evt ? $(evt.currentTarget).data('href') : null;
        if(url) {
            window.open(url, "_blank");
        }
    }
});

function initSlideshow($context, options) {
    $context.slidesjs(_.extend({
        width: 960,
        height: 305,
        navigation: false
    }, options));
}

module.exports = CarouselView;
