var Backbone = global.Backbone,
    $ = global.$,
    HomeView = require('./views/Home');

var HomeRouter = Backbone.Router.extend({
    routes: {
        'private': 'private',
        'lab': 'lab',
        '*path': 'home'
    },

    /**
     * @Override route()
    route: function(route, name, cb) {
        if(!cb) cb = this[name];

        Backbone.Router.prototype.route.call(this, route, function(){
            //console.log("routing to " + route );
            cb.apply(this, arguments);
        });
    },
     */

    home: function() {
        var view = new HomeView({
            el: '#view'
        });
        view.render();
    },

    private: function() {
        console.log("we should be here ONLY if authenticated");
        var view = new HomeView({
            el: '#view'
        });
        view.render();
    },

    lab: function() {
        //to the lab
    }
});

module.exports = HomeRouter;
