module.exports = function concat(grunt) {
    return {
        concat: {
            options: {
                separator: ";"
            },
            dev: {
                src: ['<%= workdir %>/app.js'],
                dest: "<%= distdir %>/js/app.js"
            },
            prod: {
                src:  [
                    'src/js/jquery-1.11.1.min.js',
                    'src/js/underscore-min.js',
                    'src/js/backbone-min.js',
                    'src/js/jquery.cycle.all.min.js',
                    'src/js/jquery.slides.min.js',
                    'src/js/jquery.jfeed.pack.js',
                    'src/js/cufon.js',
                    '<%= workdir %>/app.js'
                ],
                dest: '<%= distdir %>/js/app.js'
            }
        }
    };
};
