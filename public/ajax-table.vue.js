Vue.component('@{.Name}@', {
    data: function () {
        let self = this;
        return {
            t1: {
                name: "Ajax Table",
                columns: [
                    'First Name',
                    'Last Name',
                    'Age',
                    {
                        name: 'Timestamp', value: function (row) {
                            return self.unix2date(row['timestamp']);
                        }
                    },
                ],
                links: [
                    {
                        icon: 'fas fa-sync-alt', exec: function () {
                            $.getJSON("data.json", function (data) {
                                self.$set(self.t1, 'rows', data);
                            });
                        }
                    },
                ],
                rows: function () {
                    $.getJSON("data.json", function (data) {
                        self.$set(self.t1, 'rows', data);
                    });
                },
            }
        }
    },
    template: '@{.Template}@'
});
