window.addEventListener("load", function() {


    //load blog posts

    $(window).resize(_.throttle(_.bind(loadFeeds, this, '#blog-posts', {
        url:'http://developme.wordpress.com/feed/',
        shift:2000,
        timeout: 8000
    }), 1000));



});

