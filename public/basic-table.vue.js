Vue.component('@{.Name}@', {
    props: ['name', 'caption', 'columns', 'rows', 'links', 'actions', 'table'],
    data: function () {
        return {
            sort: -1,
            ascending: true,
            filters: [],
        }
    },
    computed: {
        $name: function () {
            return this.property('name');
        },
        $caption: function () {
            return this.property('caption');
        },
        $columns: function () {
            let cols = [];
            $.each(this.property('columns'), function (idx, col) {
                if (typeof col === 'object') {
                    cols.push(col);
                } else if (typeof col === 'string') {
                    cols.push({
                        name: col, value: function (r) {
                            let n = col.replace(/ /g, '');
                            n = n.charAt(0).toLowerCase() + n.substring(1);
                            return r[n];
                        }
                    });
                }
            });
            return cols;
        },
        $rows: function () {
            let rows = this.property('rows');
            if (typeof rows === "function") {
                rows = rows();
            }
            return rows;
        },
        $links: function () {
            return this.property('links');
        },
        $actions: function () {
            return this.property('actions');
        },
        filteredAndSortedRows: function () {
            let self = this;
            let returnValue = self.ascending ? -1 : 1;

            let data = [];

            let filterMap = {};
            $.each(self.filters, function (idx, f) {
                if (filterMap[f.name] === undefined) {
                    filterMap[f.name] = [];
                }
                filterMap[f.name].push(f);
            });

            $.each(self.$rows, function (idx, d) {
                let valid = true;
                $.each(filterMap, function (k, v) {
                    let filterMatch = false;
                    $.each(v, function (idx, f) {
                        let col = self.$columns[f.idx];
                        let val = self.value(col, d).value;
                        if (val.match(f.value)) {
                            filterMatch = true;
                        }
                    });
                    if (!filterMatch) {
                        valid = false;
                    }
                });

                if (valid) {
                    data.push(d);
                }
            });

            return data.sort(function (a, b) {
                if (self.sort < 0) {
                    return 0;
                }
                let col = self.$columns[self.sort];
                if (self.value(col, a).value < self.value(col, b).value)
                    return returnValue;
                if (self.value(col, a).value > self.value(col, b).value)
                    return returnValue * -1;
                return 0;
            });
        }
    },
    methods: {
        property: function (name) {
            if (this.$props[name] !== undefined) {
                return this.$props[name];
            }
            if (this.table !== undefined && this.table[name] !== undefined) {
                return this.table[name];
            }
        },
        rowActions: function (data) {
            if (typeof this.$actions === 'function') {
                return this.$actions(data);
            }
            return this.$actions;
        },
        value: function (col, data) {
            if (col.value !== undefined) {
                let val = col.value(data);
                if (typeof val !== 'object') {
                    val = {value: val};
                }
                if (val.value === undefined) {
                    val.value = "";
                }
                if (val.style === undefined) {
                    val.style = {};
                }
                return val;
            }
            return {value: "<i style='color:red'>no value function defined on col</i>"};
        },
        showSortArrow(col, idx, dir) {
            switch (dir) {
                case 'none':
                    if (col.sort === false) {
                        return false;
                    }
                    return idx !== this.sort;
                case 'asc':
                    if (col.sort === false) {
                        return false;
                    }
                    return !this.ascending && idx === this.sort;
                case 'desc':
                    if (col.sort === false) {
                        return false;
                    }
                    return this.ascending && idx === this.sort;
                case 'filter':
                    return col.filter !== false;
            }
            return false;
        },
        sortBy(col, idx, ascending) {
            let self = this;
            self.sort = idx;
            self.ascending = ascending;
        },
        filterBy(col, idx) {
            this.filters.push({name: col.name, idx: idx, value: ''});
        },
        removeFilter(filter) {
            const index = this.filters.indexOf(filter);
            if (index !== -1) this.filters.splice(index, 1);
        },
    },
    template: '@{.Template}@'
});