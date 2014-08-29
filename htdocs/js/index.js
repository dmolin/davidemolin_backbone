window.addEventListener("load", function() {

    //activate slides
    activateSlides(".slideshow .slides", {width: 960, height: 305});
    activateSlides(".testimonials .slides", {width: 310, height: 305});

    //handle click on slides
    $('.slides .slide').click( function() {
        var url =$(this).data('href');
        if(url) {
            window.open(url, "_blank");
        }
    });

    //handle collapsing sections
    setupCollapsibles();


    function activateSlides(selector, options) {
      $(selector).slidesjs(_.extend({
          width: 960,
          height: 305,
          navigation: false
      }, options));
    }

    function setupCollapsibles() {
        //$(".desc").hide();
        $(".open-close").click(function(){
          if ($(this).is(".current"))
          {
           $(this).removeClass("current");
           $(this).next(".desc").slideUp(400);
          }
          else
          {
           $(".desc").slideUp(400);
           $(".open-close").removeClass("current");

           $(this).addClass("current");
           $(this).next(".desc").slideDown(400);
          }
         });
    }
});

