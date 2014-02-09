var MedalModel = function () {
    var self = this;

    self.medals = ko.observableArray();
    self.filter = ko.observable();

    self.getMedals = function () {
        $.getJSON('/medals', function (data) {
            console.log(data);
            self.medals(data);
        });
    }.bind(self);

    self.medalsToShow = ko.computed(function () {
        var filterString = self.filter();
        if (filterString === '' || filterString === undefined) return self.medals();
        return ko.utils.arrayFilter(self.medals(), function (item) {
            return item.name.toLowerCase().indexOf(filterString.toLowerCase()) !== -1;
        });
    }, this);
};

ko.applyBindings(new MedalModel());