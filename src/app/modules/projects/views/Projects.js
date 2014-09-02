var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    ProjectView = require('./Project'),
    tpl = require('./templates');

var ProjectsView = Base.View.extend({
    tagName: "div",
    template: tpl.views.Projects,

    afterRender: function() {
        if(!this.collection.length) return;

        //renders each project into the project list
        var $ctx = this.$('[data-id=projects-list]'),
            fragment = $(document.createDocumentFragment());

        _.each( _.map(this.collection.models, _.bind(this._renderProject, this)), function(view) {
            fragment.append(view.$el);
        });
        $ctx.append(fragment);
    },

    _renderProject: function(prj) {
        var view = new ProjectView({model: prj});
        return view.render();
    }
});

module.exports = ProjectsView;
