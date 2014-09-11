My Personal Homepage as a SPA (Single Page Application)
========================================================

Albeit at the moment this is a simple page, I opted for implementing it as a full featured Single Page App. with Backbone, to make room for growing it into a more complex application.

I also took it as a chance to tackle a new challenge in finding a better way to structure a Backbone application, in order to make it easier to scale.

The page offers a responsive experience (along with touch interactions for the carousels):

[![ScreenShot](https://raw.github.com/dmolin/www.davidemolin.com/master/README/davidemolin.jpg)](http://www.davidemolin.com)

### Technologies Used ###

- Backbone (1.1.2) with jQuery + lodash
- Backbone.base (my other npm/github project  [here](https://github.com/dmolin/backbone.base))
- Common/JS with browserify and node modules
- Node.js + Grunt and a bunch of plugins for the build process

### Why I'm not adhering to the common MVC folder hierarchy bandwagon ###

I intentionally deviated from the mainstream approach in developing Backbone Applications using the classic MVC folder-based structure.
In the 'classic' approach, the application is organised around a fixed folder hierarchy:

<pre>
source/
    models/
    collections/
    views/
    routers/
</pre>

This approach works well but it soon shows its shortcomings as your application grows, with folders housing dozens (or hundreds) of components, scattered around the entire folder hierarchy.
There are known drawbacks in using this approach:

- It doesn't scale well
- a single unit of work (a "component") is sistematically scattered amongs 3 or 4 different folders (model+collection+view[+router])
- as your codebase grows it makes more difficult to locate components, making you 'jump' continually between folders
- it's difficult to 'plug in' or 'plug out' a piece of functionality without affecting the whole folder hierarchy (just adding a new component means you have to touch all the folders to host its model/view/collection/router... )

There's another approach that has been getting quite a lot of attention recently, about organizing your application around its "features" instead of its code. That's the approach I've been following with this project, and it's proving to be quite interesting...

### Backbone "modules" and how to structure your code around its features ###

I interpret a "feature" as a discreet piece of "functionality" or an identifiable area of your application. The idea I followed was that structuring an application this way, where each functionality is implemented by a discreet "module", should make extending/changing your application a less painful experience.

The basic idea is simple: Each functional area of the application is turned into a folder in your codebase:

<pre>
source/
    modules/
        common/
        home/
        carousel/
        admin/
        labs/
        ....
</pre>

Each module is "self-contained": it contains the whole range of models/collections/views/routers necessary for it to carry out its work:

<pre>
source/
    modules/
        home/
            views/
                Home.js
                Home.html
            models/
                Home.js
            router.js
</pre>

A <i>common</i> module is also present; it contains all the common functionalities used by nearly all the other modules.
I immediately loved the idea of using this elegant structure but first I had to figure out how to transfer this idea to working code...

### Challenge: How to handle dependencies between Backbone modules ###

Although the idea of independent self-contained modules is pretty alluring, we leave in a social world and no individual "is an island"; that means that in order to have our application doing something useful, we need to make our modules communicate between each others or <i>mingle</i> in some way...

The obvious case here is the <i>common</i> module, that contains by definition a set of functionalities (<i>helpers/ViewHelpers</i> to name one) that are useful to all the other modules. One option could've been to simply require the specific file where necessary but this was not an acceptable solution, because it would've forced each module to specify the entire path to the required resource "every" single time:


```javascript
(extract from modules/home/views/Home.js)

var Backbone = global.Backbone,
    Base = require('backbone.base'),
    ViewHelpers = require('../../common/helpers/ViewHelpers'),
    tpl = require('./templates');

var HomeView = Base.View.extend({
    template: tpl.views.Home
});

```

This approach works, but we face a problem here: if we want to know who a module is dependent from, we need to dig into ALL of its files looking for <i>require</i> statements crossing its boundaries....  that's simply *awful* and unacceptable.

#### Module index to the rescue ####

The solution I've found to date is simple yet elegant; it's all about leveraging the module "index.js" file. this file (that will be soon auto-generated by Grunt for each module folder) is the entry-point for the module. It exports what the module wants to be visible to the <i>outside world</i> (the other modules).
I decided to <i>augment</i> the index.js, adding a <i>deps</i> property indicating (and resolving) all the dependencies this module has with the outside world:

```javascript
(from modules/home/index.js)

var homeIndex = {
    views: require('./views'),
    deps: {
        common: require('../common'),
        carousel: require('../carousel'),
        projects: require('../projects')
    }
};

module.exports = homeIndex;
```

This approach bears 2 important bonues:

- it groups all the dependencies in ONE single place for each module
- the files within each module rely only on the interface exposed by the module index when requiring dependencies

```javascript
(from modules/home/views/Home.js)

var Backbone = global.Backbone,
    Base = require('backbone.base'),
    Module = require('../index'),
    ViewHelpers = Module.deps.common.helpers.ViewHelpers,
    CarouselView = Module.deps.carousel.views.Carousel,
    ProjectsView = Module.deps.projects.views.Projects,
    tpl = require('./templates');

var HomeView = Base.View.extend({
    template: tpl.views.Home
});
```

..and it just works... Ohhh YEAH

![ScreenShot](https://raw.github.com/dmolin/www.davidemolin.com/master/README/yeah.jpg)


### Challenge: Per-Module Templates ###

Ok, another challenge on the horizon. I like to have all my templates (I mean, the markup) separated from the view code, where each template has the same name of the file containing the related view:

```
modules/
    home/
        views/
            Home.js
            Home.html
```

#### How I was doing it before ####

In the classic MVC folder approach, I already had a custom grunt task (under <i>/build-tasks/buildtemplates.js</i>) in place: it was finding out all the .html files, parsing and compiling them into their undercore template form and concatenate the whole lot into a single template.js file, namespacing each file with the folder it was contained into:

So, for example, the view folder content:

```
views/
    PolicyView.js
    PolicyView.html
    detail/
        DetailView.js
        DetailView.html
```

was turned into a <i>views/templates.js</i> exposing the following entities:

```javascript
{
    views: {
        PolicyView: [underscore compiled template],
        detail: {
            DetailView: [underscore compiled template]
        }
    }
}
```
In all the application, there was hence a single template.js file containing all the compiled templates.
After that it was just a matter of requiring and using the template file in the view:

```javascript
var tpl = require('./templates');

var PolicyView = Backbone.View.extend({
    template: tpl.views.PolicyView
});
```

The new problem I was facing now was that in order for the new multi-module system to work, I needed to have a <i>template.js</i> file generated for each single module....

![Screenshot](https://raw.github.com/dmolin/www.davidemolin.com/master/README/onedoesnot.jpg)


#### Figuring out how to make it work with multiple Backbone modules ####

The previous approach was in need of serious rethinking now that I was using a modular approach. Having multiple Backbone modules means that each one of them should have its own set ot templates. That means that the previous process should be repeated once for each module.
With a bit of tweaking I got what I wanted, so now we have a <i>/views/templates.js</i> file for each module, containing only the templates present in that specific module:

![ScreenShot](https://raw.github.com/dmolin/www.davidemolin.com/master/README/templates.png)

```
modules/
    home/
        views/
            templates.js
    carousel/
        views/
            templates.js
```

### Update: Solving circular dependencies ###

When rolling my code with this approach I soon stumbled upon an unforeseen issue: a circular dependency.

The problem arose when refactoring the recommendation list (originally hardcoded in the markup) into a discreete module, under <strong>/modules/recommendations</strong>

I started creating the usual module index:

```javascript
var RecommendationsModule = {
    models: require('./models'),
    views:  require('./views'),
    deps: {
        common: require('../common')
    }
};

module.exports = RecommendationsModule;
```

All good.
Then I jumped into the Recommendations view, basically a view managing a collection of recommendations:

```javascript
var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    Module = require('../'),
    tpl = require('./templates');

var RecommendationsView = Base.View.extend({
    tagName: "div",
    className: "slides",
    template: tpl.views.Recommendations,

    afterRender: function() {
        var ViewHelpers = Module.deps.common.helpers.ViewHelpers;

        //initialize slideshow, using a common helper
        if(this.$('.slide').length) {
            ViewHelpers.initSlideshow( this.$el, {width: 300, height: 270 });
        }
    }
});

module.exports = RecommendationsView;
```

Pretty sure that everything was jolly good (no errors from the linter) I run <strong>grunt dev</strong> (the <strong>dev</strong> param is for avoiding minification) and the jumped in the browser.

#### B-O-O-M ! ####

No good. I get an error from the console that states that <strong>helpers</strong> cannot be found on an undefined object...
mmh.. that means that <strong>Module.deps</strong>, in my <strong>afterRender</strong> function, seems to be unresolved...

I get a feeling in my guts: I try to print out the entire <strong>Module</strong> object and what do I get ?

```javascript
{}
```

WOW. How's that possible ? The console is telling me that my module index.js does not resolve ?
I try moving things around. I try changing the index.js into a simple literal that doesn't require anything and contains only a boolean:

```javascript
module.exports = {
  resolved: true
}
```

Then I load it from the Home module, just for checking that it resolves.

And it does.

Ok, so I know that the issue is happening <i>within</i> the module itself..

Then I get it.

What's happening is the following:

```
1) Module "home" requires module "recommendations"
2) recommendations/index.js is loaded
   2.1) the file gets processed and the require for the view is performed
   2.2) the view file views/Recommendations.js "tries" to require the module index...
   2.3) the module index is, currently, empty, since it's not yet fully processed
```

So that's the problem.
When the view requires its own index file, the file is still in processing and thus the common empty structure is returned.
Proof is, if I move the require <strong>within</strong> the view methods (<i>initialize</i> as an example) I get the correct module index.

That's a bloody circular reference:

```
Module --> view --> Module
```

#### How I solved it and saved my day

Thinking about it I realised that there was only one reason why I was requiring the entire Module index from within my view: <i>the list of the module dependencies.</i>

There's a clever way to solve this circular dependency issue; The same way we were used to implement Many-to-Many relationships within a relational DBMS:

<strong>The middleman</strong>

this is the basic idea:

```
Module --> view
Module --> deps
view --> deps
```

I moved the dependencies <strong>out</strong> of the module index and into a <strong>deps.js</strong> file:

```javascript
//file: module deps.js

module.exports = {
  common: require('../common')
};
```
Then I loaded this dependency from both the Module index and the view;

```javascript
//file: module index.js

var RecommendationsModule = {
    models: require('./models'),
    views:  require('./views'),
    deps: require('./deps')
};

module.exports = RecommendationsModule;
```

```javascript
var _ = global._,
    Backbone = global.Backbone,
    Base = require('backbone.base'),
    deps = require('../deps'),
    tpl = require('./templates');

var RecommendationsView = Base.View.extend({
  ...
});
```

It works. circularity averted and everything now resolves correctly.
Not only that. Now I can easily generate all my index.js files automatically via <strong>Grunt</strong> task,
since the only variable information there is stored in a separate file (<i>deps.js</i>)
