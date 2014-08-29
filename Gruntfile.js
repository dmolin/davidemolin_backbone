module.exports = function (grunt) {
    grunt.loadNpmTasks("grunt-contrib-sass");

    grunt.initConfig({
    });

    // Register alias tasks
    grunt.registerTask("dev", ["sass"]);

    // Default task.
    grunt.registerTask("default", ["dev"]);

};
