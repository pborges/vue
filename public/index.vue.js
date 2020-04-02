Vue.component('@{.Name}@', {
    data: function () {
        let self = this;
        return {
            t1: {
                name: 'table',
                caption: 'long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs long caption ohhh yeahs',
                columns: [
                    'One',
                    'Two',
                    'Three',
                    {
                        name: 'Four',
                        style: {
                            color: "#00ff00",
                        },
                        value: function (row) {
                            return row.four + " - blerg";
                        }
                    },
                ],
                rows: [
                    {one: '1', two: '2', three: '3', four: '4'},
                    {one: 'a1', two: 'a2', three: 'a3', four: 'a4'},
                    {one: 'b1', two: 'b2', three: 'b3', four: 'b4'},
                    {one: 'http://google.com', two: 'b2', three: 'b3', four: 'b4'},
                ],
                links: [
                    {
                        name: 'link1', exec: function () {
                            self.alert('hi', 'info', 3000);
                        }
                    },
                    {
                        name: 'dropdown test',
                        dropdown: [
                            {
                                name: "d1", exec: function () {
                                    self.alert('d1', "info", 3000);
                                }
                            },
                            {
                                name: "d2", exec: function () {
                                    self.alert('d2', "info", 3000);
                                }
                            }
                        ],
                    },
                ],
                actions: function (row) {
                    let actions = [
                        {
                            name: 'a1', exec: function (row) {
                                self.alert(row, 'success', 3000);
                            }
                        },
                        {
                            name: 'dropdown test',
                            dropdown: [
                                {
                                    name: "d1", exec: function () {
                                        self.alert('d1', "info", 3000);
                                    }
                                },
                                {
                                    name: "d2", exec: function () {
                                        self.alert('d2', "info", 3000);
                                    }
                                }
                            ],
                        },
                    ];
                    if (row.one.startsWith("http")) {
                        actions.push({
                            name: 'open',
                            class: ['btn-success'],
                            exec: function (row) {
                                window.location = row.one;
                            }
                        });
                    }
                    return actions;
                }
            }
        }
    },
    template: '@{.Template}@'
});
