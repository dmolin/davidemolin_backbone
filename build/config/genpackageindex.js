/*
 * Copy static assets to {distdir}
 */
module.exports = function _genpackageindex(grunt) {
    return {
        genpackageindex: {
            options: {
                files: [
                    "<%= srcdir %>/modules/**"
                ]
            }
        }
    };
};


