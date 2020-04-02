Vue.component('@{.Name}@', {
    props: ['alerts'],
    methods: {
        clear: function (idx) {
            this.alerts.splice(idx, 1);
        }
    },
    template: '@{.Template}@'
});
