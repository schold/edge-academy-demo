var MedalModel = function() {
    var self = this;
    self.medals = ko.observableArray();
    self.getMedals = function() {
        $.getJSON('/medals', function (data) {
            console.log(data);
            self.medals(data);
        });
    }.bind(self);
};

ko.applyBindings(new MedalModel());