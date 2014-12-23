var Backbone = global.Backbone,
    Base = require('backbone.base'),
    deps = require('../deps'),
    ViewHelpers = deps.common.helpers.ViewHelpers,
    CarouselView = deps.carousel.views.Carousel,
    recommendations = deps.recommendations,
    projects = deps.projects,
    tpl = require('./templates');

var HomeView = Base.View.extend({
    template: tpl.views.Home,

    events: {
    },

    renderSubviews: function() {
        var projectsColl = new projects.models.Projects(),
            recommendationsColl = new recommendations.models.Recommendations();

        this.setSubview("slideshow", "[data-id=slideshow]", new CarouselView());
        this.setSubview("projects", "[data-id=projects]", new projects.views.Projects({collection:projectsColl}));
        this.setSubview("recommendations", "[data-id=recommendations]", new recommendations.views.Recommendations({collection:recommendationsColl}));

        projectsColl.fetch({reset:true});
        recommendationsColl.fetch({reset:true});
    },

    afterRender: function() {
        var feedsData;

        //load blog posts
        feedsData = {
            url:'http://developme.wordpress.com/feed/',
            shift:1000,
            timeout: 8000
        };
        ViewHelpers.loadFeeds( this.$('#blog-posts'), feedsData);

        //blog post block needs re-rendering when resizing event occurs
        callFunctionWhenSizeChanges(
            function() { return this.$('#blog-posts').width(); },
            _.bind(ViewHelpers.loadFeeds, ViewHelpers, this.$('#blog-posts'), feedsData) );

        //setup collapsible sections
        ViewHelpers.collapsible(this);

        //if there's an active section, make it active!
        if(this.options.active) {
            this.makeActive(this.options.active);
        }
    },

    makeActive: function(section) {
        var $section = this.$(section);
        if($section.length) {
            $(document.body).animate({
                scrollTop: $section.offset().top
            }, 500, function() {
                $section.find('.open-close').click();
            });

        }
    }

});


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
