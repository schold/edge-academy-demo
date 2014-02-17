/**
 * Normally you wouldn't use only Backbone and Underscore, and certainly never
 * keep all routers, models, collections or views in the same file. But it
 * proves the point for this example.
 *
 * This code is only created to prove a point, no optimization or best practice
 * has been taken into account
 */

// Let's put the App in global-scope, normally a more unique name would be preferable
// but since I control the scope I can do as I god-damned like.
var App = {
    Models: {},
    Collections: {},
    Views: {},
    Routers: {},

    init: function() {
        new App.Routers.FeedRouter();
        Backbone.history.start();
    }
}

// Backbone model of feed item
App.Models.Feed = Backbone.Model.extend({
    defaults: {
        id: null,
        name: null,
        rank: null,
        rankStr: null,
        gold: null,
        silver: null,
        bronze: null,
        total: null
    }
});

// Backbone collection of serveral feed items (acts like a sortable and
// filterable container for models)
App.Collections.Feeds = Backbone.Collection.extend({
    // Define model for this collection
    model: App.Models.Feed,
    // Define end-point to fetch data from
    url: '/medals',
    // Define method for filtering collection base on search string
    search: function(letters) {
        if (letters == "") return this;

        var pattern = new RegExp(letters, "gi");

        return _(this.filter(function(data) {
            return pattern.test(data.get("name"));
        }));
    }
});

// Backbone view for our List Items
App.Views.ListItem = Backbone.View.extend({
    // No events needed
    events: {},
    // Using setElement is possible since Backbone.js v0.9
    render: function(data) {
        this.setElement(this.template(this.model.toJSON()));
        return this;
    },
    // It's not optimal but it shows the gist
    initialize: function() {
        this.template = _.template($("#list_item_tpl").html());
    }
})

// Backbone view for our List Container
App.Views.ListContainer = Backbone.View.extend({
    // Define some events for this View's functionality
    events: {
        "keyup #medalFilter": "search",
        "click .btn": "fetch"
    },
    // Another way to render (instead of setElement), but when we haven't
    // defined tagName the template will be wrapped by empty div
    render: function(data) {
        $(this.el).html(this.template);
        return this;
    },
    // Nothing special. Emptying countryList and populate with each object in the collection
    renderList: function(countries) {
        $("#countryList").html("");

        countries.each(function(country) {
            var view = new App.Views.ListItem({
                model: country,
                collection: this.collection
            });
            $("#countryList").append(view.render().el);
        });
        return this;
    },
    // Setting view template and binds method "render" to trigger in case of event "reset"
    initialize: function() {
        this.template = _.template($("#list_container_tpl").html());
        this.collection.bind("reset", this.renderList, this);
    },
    // Grab text from input field and pass it to the collections search method
    search: function(e) {
        var letters = $("#medalFilter").val();
        this.renderList(this.collection.search(letters));
    },
    // Populates collection from endpoint, forcing reset event to trigger
    fetch: function(e) {
        this.collection.fetch({reset: true});
    }
});

// Backbone router
App.Routers.FeedRouter = Backbone.Router.extend({
    initialize: function() {
        this.collection = new App.Collections.Feeds();
    },
    // Demonstrating routing in Backbone
    routes: {
        ''      : 'index',
        '/index': 'index'
    },
    // Pass collection to View during instantiation for handier handling
    index: function() {
        this.listContainerView = new App.Views.ListContainer({
            collection: this.collection
        });

        $("#contentContainer").append(this.listContainerView.render().el);
    }
});

App.init();