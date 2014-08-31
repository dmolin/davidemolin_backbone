var path = require('path'),
    fs = require('fs');

module.exports = function buildtemplates(grunt) {
    var moduleBlocks;

    //process modules. each module will be processed individually, with its own templates.js file
    var modules = fs.readdirSync('./src/app/modules'),

    moduleBlocks = modules.map(function(module) {
        return {
            name: module,
            src: "<%= srcdir %>/modules/" + module + "/views/**/*.html",
            dest: "<%= srcdir %>/modules/" + module + "/views/templates.js",
            template: "module.exports = {{=templates}};"
        };
    });

    return {
        buildtemplates: {
            all: moduleBlocks
        }
    };
};