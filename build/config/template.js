module.exports = function index(grunt) {
    return {
        template: {
            options: {},
            dev: {
                options: {
                    data:{
                        scripts: [
                            '<script src="js/jquery-1.11.1.min.js"></script>\n',
                            '<script src="js/underscore-min.js"></script>\n',
                            '<script src="js/backbone-min.js"></script>\n',
                            '<script src="js/jquery.cycle.all.min.js?ver=1.0"></script>\n',
                            '<script src="js/jquery.slides.min.js?ver=1.0" type="text/javascript" charset="utf-8"></script>\n',
                            '<script src="js/jquery.jfeed.pack.js?ver=1.0" async defer></script>\n',
                            '<script src="js/cufon.js?ver=1.0"></script>\n',
                            '<script src="js/app.js"></script>'
                        ].join('')
                    }
                },

                files: {
                    '<%= distdir %>/index.html': ['src/index.html.tpl']
                }
            },

            prod: {
                options:{
                    data:{
                        scripts: [
                            '<script src="js/app.js"></script>\n'
                        ].join('')
                    }
                },

                files: {
                    '<%= distdir %>/index.html': ['src/index.html.tpl']
                }
            }
        }
    };
};