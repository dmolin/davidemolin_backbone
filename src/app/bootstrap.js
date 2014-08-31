//var _ = require("underscore");
//var Backbone = require('backbone');
//var $ = require('jquery-browserify');
//Backbone.$ = $;
//global._ = _;
//var Routes = require('./modules/tictactoe/routers/routes');

global._ = _;
global.$ = $;
global.Backbone = Backbone;
require('./libs/backbone.queryparams');

var Router = require('./modules/home/router');
new Router();

$(function(){
    console.log("inited");
    Backbone.history.start();
});
