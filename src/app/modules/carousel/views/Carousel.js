var Backbone = global.Backbone,
    Base = require('backbone.base'),
    deps = require('../deps'),
    tpl = require('./templates');

var CarouselView = Base.View.extend({
    template: tpl.views.Carousel,
    className: "slides",

    events: {
        'click .slide': 'onSlideSelection'
    },

    afterAttach: function() {
        //init slideshow
        deps.common.helpers.ViewHelpers.initSlideshow(this.$el, {width: 960, height: 610});

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


module.exports = CarouselView;
