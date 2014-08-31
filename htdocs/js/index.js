window.addEventListener("load", function() {

    //activate slides
    activateSlides(".slideshow .slides", {width: 960, height: 305});
    activateSlides(".testimonials .slides", {width: 300, height: 270 });

    //handle click on slides
    $('.slides .slide').click( function() {
        var url =$(this).data('href');
        if(url) {
            window.open(url, "_blank");
        }
    });

    //handle collapsing sections
    setupCollapsibles();

    //load blog posts
    loadFeeds( '#blog-posts', {
        url:'http://developme.wordpress.com/feed/',
        shift:2000,
        timeout: 8000
    });

    $(window).resize(_.throttle(_.bind(loadFeeds, this, '#blog-posts', {
        url:'http://developme.wordpress.com/feed/',
        shift:2000,
        timeout: 8000
    }), 1000));


    function activateSlides(selector, options) {
        $(selector).slidesjs(_.extend({
            width: 960,
            height: 305,
            navigation: false
        }, options));
    }

    function setupCollapsibles() {
        $(".open-close").click(function(){
            $(this).next().slideToggle(400);
            if($(this).hasClass("current")) { $(this).removeClass("current"); } else { $(this).addClass("current"); }
         });
    }

    function loadFeeds( contId, InOptions )
    {
        var options = $.extend( {
                        url:'empty.xml',
                        showTitle:true,
                        showTimestamp:true,
                        lines:150
                    }, InOptions ),
                shift = options.shift,
                cont = $(contId);

        if( typeof shift !== 'undefined' && shift > 0 )
        {
            options.shift = 0;
            setTimeout( function(){ loadFeeds(contId, options); }, shift );
            return;
        }

        cont.html('<p>Wait, Feeds are loading...</p>');
        $.getFeed( {
            url: (options.type === 'json' ? '/jsonproxy' : '/proxy') + '.php?url=' + options.url,

            success: function(data) {
                var toAppend = $(document.createElement( "div" )).addClass( "feed-list" ),
                        node,
                        i,
                        feed = { items: (data.items || data) },
                        map = {
                            link : (options.fields && options.fields.link) || 'link',
                            text : (options.fields && options.fields.description) || 'description',
                            title: (options.fields && options.fields.title) || 'title',
                        };

                for( i = 0; i < feed.items.length; i++ )
                {
                    node = feed.items[i];
                    $(toAppend).append(
                        "<div class='feed-item slide' data-slideshow-index='" + i + "'>" +
                        (options.showTitle ? "<span class='feed-title' ><a href='" + node[map.link] + "'>" + node[map.title] + "</a></span>" : "" ) +
                        (options.showTimestamp ? "<span class='feed-tstamp'>" + node.updated + "</span>" : "" ) +
                        "<p>" + node[map.text].substring(0,options.lines) + (node[map.text].length > options.lines ? "... <a href='" + node[map.link] + "'>Read More</a>" : "" ) +
                        "</p>" +
                        "</div>\n"
                    );
                }
                cont.empty();
                cont.append( toAppend );
                $(".feed-list", cont ).cycle({
                    fx: 'scrollUp',
                    timeout: options.timeout || 10000,
                    speed: 3000,
                    pause: 1,
                    cleartype: true,
                    cleartypeNoBg: true,
                    startingSlide: 0
                });
            }
        });
    }
});

