var Backbone = global.Backbone,
    Base = require('backbone.base'),
    Module = require('../index'),
    ViewHelpers = Module.deps.common.helpers.ViewHelpers,
    CarouselView = Module.deps.carousel.views.Carousel,
    tpl = require('./templates');

var HomeView = Base.View.extend({
    template: tpl.views.Home,

    events: {
        //'click .slides .slide': 'onSlideSelection'
    },

    renderSubviews: function() {
        this.setSubview("slideshow", "[data-id=slideshow]", new CarouselView());
        //this is necessary to calculate the slideshow dimensions (this can happen ONLY after
        //the slideshow has been attached to the DOM)
        this.getSubview("slideshow").layout();
    },

    afterRender: function() {
        var feedsData;

        if(Cufon) {
            Cufon.replace('.open-close,h2,h3',{ hover: 'true' });
        }

        //init slideshow
        //initSlideshow(this.$(".slideshow .slides"), {width: 960, height: 305});
        initSlideshow(this.$(".testimonials .slides"), {width: 300, height: 270 });

        //load blog posts
        feedsData = {
            url:'http://developme.wordpress.com/feed/',
            shift:1000,
            timeout: 8000
        };
        ViewHelpers.loadFeeds( this.$('#blog-posts'), feedsData);

        //blog post block needs re-rendering when resizing event occurs
        callFunctionWhenSizeChanges(
            function() { return this.$('#blog-posts').width() },
            _.bind(ViewHelpers.loadFeeds, ViewHelpers, this.$('#blog-posts'), feedsData) );

        //setup collapsible sections
        ViewHelpers.collapsible(this);
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

function loadBlogPosts() {
    loadFeeds( '#blog-posts', {
        url:'http://developme.wordpress.com/feed/',
        shift:2000,
        timeout: 8000
    });
}

function callFunctionWhenSizeChanges(getSizeFn, fn) {
    var lastWidth = getSizeFn();
    $(window).resize(_.throttle(checkSizeAndReload, 1000));


    function checkSizeAndReload() {
        if(getSizeFn() != lastWidth) {
            fn();
            lastWidth = getSizeFn();
        }
    }
}

module.exports = HomeView;
