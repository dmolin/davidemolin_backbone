var Backbone = global.Backbone,
    $ = global.$,
    HomeView = require('./views/Home');

var HomeRouter = Backbone.Router.extend({
    routes: {
        '*path': 'home'
    },

    home: function() {
        var view = new HomeView({
            el: '#view'
        });
        view.render();
    }
});

module.exports = HomeRouter;
