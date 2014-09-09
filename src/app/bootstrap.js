global._ = _;
global.$ = $;
global.Backbone = Backbone;
require('./libs/backbone.queryparams');

var Router = require('./modules/home/router');
new Router();

$(function(){
    Backbone.history.start();
});
