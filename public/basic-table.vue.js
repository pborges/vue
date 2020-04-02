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
            if (this.table !== undefined) {
                return this.table.name;
            }
            return this.name;
        },
        $caption: function () {
            if (this.table !== undefined) {
                return this.table.caption;
            }
            return this.caption;
        },
        $columns: function () {
            let cols = [];
            let c = this.columns;
            if (this.table !== undefined) {
                c = this.table.columns;
            }
            $.each(c, function (idx, col) {
                if (typeof col === 'object') {
                    cols.push(col);
                } else if (typeof col === 'string') {
                    cols.push({
                        name: col, value: function (r) {
                            return r[col.toLowerCase()];
                        }
                    });
                }
            });
            return cols;
        },
        $rows: function () {
            if (this.table !== undefined) {
                return this.table.rows;
            }
            return this.rows;
        },
        $links: function () {
            if (this.table !== undefined) {
                return this.table.links;
            }
            return this.links;
        },
        $actions: function () {
            if (this.table !== undefined) {
                return this.table.actions;
            }
            return this.actions;
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