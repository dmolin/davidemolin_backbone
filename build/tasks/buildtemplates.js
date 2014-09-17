/*global module: true, require: true */
var glob = require('glob-all');


module.exports = function (grunt) {

    var path = require("path"),

    // Can't use Grunt underscore as it is a version that doesn't support compiling templates
    _ = require("underscore");
    _.templateSettings.evaluate = /(?:<%|evaluate=")([\s\S]+?)(?:%>|end=")/g;

    function sliceLastChar(string) {
        return string.substr(0, string.length - 1);
    }

    function createNamespace(namespace, source) {
        //go through namespace with '/' and create empty literals under source...
        var modules = namespace.split('/');
        var root = source;
        _.each(modules, function(module){
            if(!root[module]) {
                root[module] = {};
            }
            root = root[module];
        });
        //root now point to the deepest namespace. let's return it
        return root;
    }

    grunt.template.addDelimiters("buildtemplates", "{{", "}}");

    grunt.registerMultiTask("buildtemplates", "Generate Javascript templates", function () {

        var that = this;

        _.each(this.data, processModule);

        function processModule(data) {
            //var that = this;
            var templates = glob.sync([data.src]),
                templatesObject = {};

            templates = templates.map(function (templateFile) {
                try {

                    grunt.log.writeln("  parsing [" + templateFile + "]");

                    var name = path.basename(templateFile, path.extname(templateFile)),
                        namespace = path.dirname(path.join(templateFile, "./")).replace('src/app/modules/' + data.name + '/', '');

                    //let's create the package structure
                    var insertionPoint = createNamespace(namespace, templatesObject);
                    insertionPoint[name] = _.template(grunt.file.read(templateFile)).source;

                } catch (e) {
                    grunt.log.error(e);
                    grunt.fail.warn("  Could not parse " + templateFile);
                }

            });

            if(!templates.length) return;

            // We can't simply JSON.stringify this as we need the function literals out:
            var templateSrc = ["{"];
            grunt.util._.each(templatesObject, function (templateGroup, grpName) {

                templatePush(templateGroup, grpName, templateSrc);

            });

            templateSrc[templateSrc.length - 1] = sliceLastChar(templateSrc[templateSrc.length - 1]);
            templateSrc.push("}");

            grunt.file.write(data.dest, grunt.template.process(data.template, {
                delimiters: "buildtemplates",
                data: { templates: templateSrc.join("\n") }
            }));
        }

        function templatePush(template, name, templateSrc){
            if(grunt.util._.isObject( template )) {
                templateSrc.push(name + ": {" );
                grunt.util._.each(template, function(item, name) {
                    templatePush(item, name, templateSrc);
                });
                templateSrc[templateSrc.length - 1] = sliceLastChar(templateSrc[templateSrc.length - 1]);
                templateSrc.push("},");
            } else {
                templateSrc.push(name + ": " + template + ",");
            }
        }
    });

};
